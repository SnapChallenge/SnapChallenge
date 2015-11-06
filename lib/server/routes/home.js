function home (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply('<a href="/logout">Logout</a>');
    } else {
        return reply('<a href="/signup">Sign Up</a>')
    }

}

module.exports = home;