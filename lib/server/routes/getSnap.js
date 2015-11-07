var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function getSnap (request, reply) {

    if (!request.payload.id) {
        return reply(Boom.badImplementation('invalid payload'));
    }

    var query = {
        _id: ObjectID(request.payload.id),
        recipient: ObjectID(request.auth.credentials._id)
    };

    db.snap.findOne(query, function (error, snap) {

        if (error) {
            return reply(Boom.badImplementation(error.message));
        }

        db.snap.remove(query, function (error) {

            if (error) {
                return reply(Boom.badImplementation(error.message));
            }

            reply(snap)
                .type('application/json');

        });

    });

}

module.exports = getSnap;
