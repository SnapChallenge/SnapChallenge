var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);

function sendSnap (request, reply) {

    if (!request.payload.image ||
            !request.payload.recipient ||
            !request.payload.duration) {
        return reply(Boom.badRequest('invalid payload'));
    }

    var snap = {
        image: request.payload.image,
        recipient: request.payload.recipient,
        duration: request.payload.duration
    };

    db.insert(snap, function (error, result) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        reply()
            .code(204);

    });

}

module.exports = sendSnap;
