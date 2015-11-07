var bcrypt = require('bcrypt-nodejs');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);
var ObjectID = mongoConnect.mongodb.ObjectID;

function signup (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    if (request.method === 'post') {

        if (!request.payload.username ||
                !request.payload.email ||
                !request.payload.password) {
            return reply.redirect('/signup?error=missing_credentials');
        }

        var userDoc = {
            username: request.payload.username,
            email: request.payload.email,
            password: bcrypt.hashSync(request.payload.password),
            friends: []
        };

        db.user.insertOne(userDoc, function (error, result) {

            if (error) {
                return reply.redirect('/signup?error=internal_server');
            }

            var userQuery = {
                _id: new ObjectID(result.insertedId)
            };

            db.user.findOne(userQuery, function (error, user) {

                if (error) {
                    return reply.redirect('/signup?error=internal_server');
                }

                request.auth.session.set(user);

                return reply.redirect('/');

            });

        });

    } else if (request.method === 'get') {

        return reply.file('lib/client/signup.html');

    }

}

module.exports = signup;
