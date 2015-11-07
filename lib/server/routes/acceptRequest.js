var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function acceptRequest (request, reply) {

    var requestQuery = {_id: new ObjectID(request.params.requestId)};

    // find friend request that user is attempting to accept
    db.request.findOne(requestQuery, function (error, request) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        if (!request) {
            return reply(Boom.notFound('friend request not found'));
        }

        var senderQuery = {_id: new ObjectID(request.sender)};
        var senderUpdate = {
            $push: {friends: new ObjectID(request.recipient)}
        };

        // add recipient of friend request to active user's friends list
        db.user.update(senderQuery, senderUpdate, function (error, result) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            var recipientQuery = {_id: new ObjectID(request.recipient)};
            var recipientUpdate = {
                $push: {friends: new ObjectID(request.sender)}
            };

            // add active user to recipient's friends list
            db.user.update(recipientQuery, recipientUpdate, function (error, result) {

                if (error) {
                    return reply(Boom.badImplementation(error.message));
                }

                // delete friend request now that users are friends
                db.request.remove(requestQuery, function (error, result) {

                    if (error) {
                        return reply(Boom.badImplementation(error.message));
                    }

                    reply()
                        .code(204);

                });

            });

        });

    });

}

module.exports = acceptRequest;
