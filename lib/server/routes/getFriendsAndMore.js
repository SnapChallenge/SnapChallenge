var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function getFriendsAndMore (request, reply) {

    var user = request.auth.credentials;

    var friendObjectIds = user.friends.map(function (friend) {
        return new ObjectID(friend);
    });

    var friendsQuery = {_id: {$in: friendObjectIds}};
    var friendsProjection = {password: 0, friends: 0};

    db.user.find(friendsQuery, friendsProjection).toArray(function (error, friends) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        var snapsQuery = {
            sender: {$in: friendObjectIds},
            recipient: new ObjectID(user._id)
        };

        user.friends = friends;

        db.snap.find(snapsQuery).toArray(function (error, snaps) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            snaps.forEach(function (snap) {

                for (var f = 0; f < user.friends.length; f++) {
                    if (snap.sender.toString() === user.friends[f]._id.toString()) {
                        user.friends[f].snap = snap;
                        break;
                    }
                }

            });

            reply(user.friends)
                .type('application/json');

        });

    });

}

module.exports = getFriendsAndMore;
