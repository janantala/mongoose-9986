'use strict';

/**
 * Module dependencies.
 */

var init = require('./config/init')();
var config = require('./config/config');
var mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db;
var connectWithRetry = function() {
    db = mongoose.connect(config.db, {keepAlive: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, function(err) {
        if (err) {
            console.error('\x1b[31m', 'Could not connect to MongoDB! - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
};

mongoose.connection.on('error', function () {
    console.log('Mongoose default connection error');
});

connectWithRetry();

// Init the express application
var app = require('./config/express')(db);
app.locals.port = config.port;
app.locals.shuttingDown = false;

// Start the app by listening on <port>
var server = require('http').createServer(app);
server.listen(config.port);

const gracefulShutdown = function() {
    app.locals.shuttingDown = true;

    console.log('Gracefully shutting down...');

    // give some time to sync load balancer during service instance draining
    setTimeout(function() {
        server.close(function () {
            mongoose.disconnect(function() {
                process.exit(0);
            });
        });
    }, 15*1000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
