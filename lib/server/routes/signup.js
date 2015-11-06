var mongoConnect = require('mongo_connect');
var db = mongoConnect.init('snapchallenge');

function signup (request, reply) {

    if (request.method === 'post') {

        if (!request.payload.email || !request.payload.password) {
            return reply.redirect('/signup?error=missing_credentials');
        }

        var query = {
            email: request.payload.email,
            password: request.payload.password
        };

        db.user.insertOne(query, function (error, result) {

            if (error) {
                return reply.redirect('/signup?error=internal_server');
            }

            db.user.findOne({_id: new mongoConnect.mongodb.ObjectID(result.insertedId)}, function (error, user) {

                if (error) {
                    return reply.redirect('/signup?error=internal_server');
                }

                request.auth.session.set(user);

                return reply.redirect('/');

            });

        });

    }

    if (request.method === 'get') {

        return reply.file('lib/client/signup.html');

    }

}

module.exports = signup;
