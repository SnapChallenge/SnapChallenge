var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function getFriendsAndMore (request, reply) {

    var userQuery = {
        _id: new ObjectID(request.auth.credentials._id)
    };
    var userProjection = {
        password: 0
    };

    db.user.findOne(userQuery, userProjection, function (error, user) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        var friendsQuery = {
            _id: {$in: user.friends}
        };
        var friendsProjection = {
            password: 0,
            friends: 0
        };

        db.user.find(friendsQuery, friendsProjection, function (error, friends) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            var snapsQuery = {
                sender: {$in: user.friends},
                recipient: new ObjectID(user._id)
            };

            user.friends = friends;

            db.user.find(snapsQuery, function (error, snaps) {

                if (error) {
                    return reply(Boom.badImplementation(error.message));
                }

                snaps.forEach(function (snap) {

                    for (var f = 0; f < user.friends.length; f++) {
                        if (snap.sender === user.friends[f]._id) {
                            user.friends[f].snap = snap;
                            break;
                        }
                    }

                });

                reply(user)
                    .type('application/json');

            });

        });

    });

}

module.exports = getFriendsAndMore;
