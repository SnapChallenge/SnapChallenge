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

        var query = {
            email: request.payload.email,
            password: request.payload.password
        };

        db.user.findOne(query, function (error, user) {

            if (error || !user) {
                return reply.redirect('/login?error=invalid_credentials');
            }

            console.log('user:', user);

            request.auth.session.set(user);

            return reply.redirect('/');

        });

    }

    if (request.method === 'get') {

        return reply.file('lib/client/login.html');

    }

}

module.exports = login;
