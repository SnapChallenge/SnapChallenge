var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function sendSnap (request, reply) {

    var snap = {
        sender: new ObjectID(request.auth.credentials._id),
        recipient: new ObjectID(request.payload.recipient),
        image: request.payload.image,
        duration: request.payload.duration
    };

    db.snap.insert(snap, function (error, result) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        reply()
            .code(204);

    });

}

module.exports = sendSnap;
