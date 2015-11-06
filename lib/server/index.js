var Hapi = require('hapi');
var config = require('config');
var path = require('path');

var server = new Hapi.Server({
    connections: {
        router: {
            isCaseSensitive: true,
            stripTrailingSlash: true
        }
    }
});

server.connection({
    port: config.server.port
});

server.register([require('hapi-auth-cookie'), require('inert')], function (error) {

    if (error) {
        throw error;
    }

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid',
        redirectTo: '/login',
        isSecure: false
    });

    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                handler: require(__dirname + '/routes/home'),
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: ['GET', 'POST'],
            path: '/login',
            config: {
                handler: require(__dirname + '/routes/login'),
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/logout',
            config: {
                handler: require(__dirname + '/routes/logout'),
                auth: 'session'
            }
        },
        {
            method: ['GET', 'POST'],
            path: '/signup',
            config: {
                handler: require(__dirname + '/routes/signup'),
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            handler: require(__dirname + '/routes/static')
        }
    ]);

    server.start(function (error) {

        if (error) {
            throw error;
        }

        console.log('server running at: ' + server.info.uri);

    });

});
