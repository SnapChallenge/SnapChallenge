var bcrypt = require('bcrypt-nodejs');
var mongoConnect = require('mongo_connect');
var config = require('config');
var db = mongoConnect.init(config.database.name);

function login (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    if (request.method === 'post') {

        if (!request.payload.email || !request.payload.password) {
            return reply.redirect('/login?error=missing_credentials');
        }

        var loginQuery = {
            $or: [
                {email: request.payload.email},
                {username: request.payload.email}
            ]
        };

        db.user.findOne(loginQuery, function (error, user) {

            if (error || !user ||
                    !bcrypt.compareSync(request.payload.password, user.password)) {
                return reply.redirect('/login?error=invalid_credentials');
            }

            delete user.password;

            request.auth.session.set(user);

            return reply.redirect('/');

        });

    }

    if (request.method === 'get') {

        return reply.file('lib/client/login.html');

    }

}

module.exports = login;
