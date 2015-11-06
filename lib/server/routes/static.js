var path = require('path');

function static (request, reply) {

    reply.file('lib/client/' + request.params.path);

}

module.exports = static;
