var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function getFriendsAndMore (request, reply) {

    var userQuery = {_id: new ObjectID(request.auth.credentials._id)};
    var userProjection = {password: 0};

    // get active user's data
    db.user.findOne(userQuery, userProjection, function (error, user) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        if (!user) {
            return reply(Boom.badRequest('user not found'));
        }

        user.id = user._id;
        delete user._id;

        var friendObjectIds = user.friends.map(function (friend) {
            return new ObjectID(friend);
        });

        var friendsQuery = {_id: {$in: friendObjectIds}};
        var friendsProjection = {password: 0, friends: 0};

        // get active user's friends
        db.user.find(friendsQuery, friendsProjection).toArray(function (error, friends) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            user.friends = friends.map(function (friend) {
                friend.id = friend._id;
                delete friend._id;
                return friend;
            });

            var snapsQuery = {
                sender: {$in: friendObjectIds},
                recipient: new ObjectID(user.id)
            };

            // get active user's snaps
            db.snap.find(snapsQuery).toArray(function (error, snaps) {

                if (error) {
                    return reply(Boom.badImplementation(error.message));
                }

                // nest most recent snap to friend object
                snaps.forEach(function (snap) {

                    for (var f = 0; f < user.friends.length; f++) {
                        if (snap.sender.toString() === user.friends[f].id.toString()) {
                            snap.id = snap._id;
                            delete snap._id;
                            user.friends[f].snap = snap;
                            break;
                        }
                    }

                });

                var requestsQuery = {
                    recipient: new ObjectID(user._id)
                };

                // get active user's pending friend requests
                db.request.find(requestsQuery).toArray(function (error, requests) {

                    if (error) {
                        return reply(Boom.badImplementation(error.message));
                    }

                    var friendRequestObjectIds = [];

                    user.requests = requests.map(function (request) {
                        friendRequestObjectIds.push(request.sender);
                        request.id = request._id;
                        delete request._id;
                        return request;
                    });

                    var friendRequestsQuery = {
                        _id: {$in: friendRequestObjectIds}
                    };

                    db.user.find(friendRequestsQuery).toArray(function (error, friendRequests) {

                        if (error) {
                            return reply(Boom.badImplementation(error.message));
                        }

                        friendRequests.forEach(function (friendRequest) {

                            for (var r = 0; r < user.requests.length; r++) {
                                if (friendRequest._id.toString() === user.requests[r].sender.toString()) {
                                    friendRequest.id = friendRequest._id;
                                    delete friendRequest._id;
                                    user.requests[r].sender = friendRequest;
                                    break;
                                }
                            }

                        });

                        reply(user)
                            .type('application/json');

                    });

                });

            });

        });

    });

}

module.exports = getFriendsAndMore;
