const app   = require('./app');
const debug = require('debug')('stj-server');
const http  = require('http');

let server = null;

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {return val;}    // named pipe
    if (port >= 0)   {return port;}   // port number

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':      throw (bind + ' requires elevated privileges');
        case 'EADDRINUSE':  throw (bind + ' is already in use');
        default:            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = {

    startServer: function(listenPort) {
        const defaultPort = '3000';
        const port = listenPort ? normalizePort(listenPort)
                                : normalizePort(process.env.PORT || defaultPort);
        app.set('port', port);

        server = http.createServer(app);
        server.listen(port);
        server.on('error', onError );
        server.on('listening', onListening);
    }
};