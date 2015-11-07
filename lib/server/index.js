var Hapi = require('hapi');
var Joi = require('joi');
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

    server.auth.strategy('session', 'cookie', config.cookie);

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
        },
        {
            method: 'GET',
            path: '/getFriendsAndMore',
            handler: require(__dirname + '/routes/getFriendsAndMore'),
            config: {
                auth: 'session'
            }
        },
        {
            method: 'POST',
            path: '/sendSnap',
            handler: require(__dirname + '/routes/sendSnap'),
            config: {
                auth: 'session',
                validate: {
                    payload: {
                        recipient: Joi.string(),
                        image: Joi.string(),
                        duration: Joi.number().integer()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/getSnap',
            handler: require(__dirname + '/routes/getSnap'),
            config: {
                auth: 'session',
                validate: {
                    query: {
                        snapId: Joi.string()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/sendFriendRequest',
            handler: require(__dirname + '/routes/sendFriendRequest'),
            config: {
                auth: 'session',
                validate: {
                    payload: {
                        searchItem: Joi.string()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/addFriend',
            handler: require(__dirname + '/routes/addFriend'),
            config: {
                auth: 'session',
                validate: {
                    query: {
                        requestId: Joi.string()
                    }
                }
            }
        }
    ]);

    server.start(function (error) {

        if (error) {
            throw error;
        }

        console.log('server running at: ' + server.info.uri);

    });

});
