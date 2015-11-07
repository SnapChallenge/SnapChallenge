var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function sendFriendRequest (request, reply) {

    var userQuery = {
        $or: [
            {username: request.payload.searchItem},
            {email: request.payload.searchItem}
        ]
    };
    var userProjection = {password: 0};

    // find user that active user wants to add
    db.user.findOne(userQuery, userProjection, function (error, user) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        if (!user) {
            return reply(Boom.notFound('user not found'));
        }

        // ensure user is not already in active user's friend list
        for (var f = 0; f < user.friends.length; f++) {
            if (user.friends[f].toString() === request.auth.credentials._id.toString()) {
                return reply(Boom.badRequest('users are already friends'));
            }
        }

        var friendRequest = {
            request_timestamp: Date.now(),
            sender: new ObjectID(request.auth.credentials._id),
            recipient: new ObjectID(user._id)
        };

        // create friend request
        db.request.insert(friendRequest, function (error, result) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            reply()
                .code(204);

        });

    });

}

module.exports = sendFriendRequest;
