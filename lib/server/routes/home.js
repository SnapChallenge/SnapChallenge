function home (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.file('lib/client/home.html');
    } else {
        return reply.file('lib/client/index.html');
    }

}

module.exports = home;
