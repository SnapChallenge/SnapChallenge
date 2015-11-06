function logout (request, reply) {

    request.auth.session.clear();

    return reply.redirect('/');

}

module.exports = logout;
