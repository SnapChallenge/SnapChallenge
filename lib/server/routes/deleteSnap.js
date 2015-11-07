var Boom = require('boom');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function deleteSnap (request, reply) {

    var query = {
        _id: ObjectID(request.path.snapId),
        recipient: ObjectID(request.auth.credentials._id)
    };

    db.snap.remove(query, function (error) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        reply()
            .code(204);

    });

}

module.exports = deleteSnap;
