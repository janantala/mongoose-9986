'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var mongoose = require('mongoose');
var request = require('request-json');

var clientConfig = require('./../../config/client');
var pathsConfig = require('./../../config/paths');

var client;
const isLocalhost = require('./helpers').isLocalhost;

describe('Blankslate app', function() {

    it('should run without problems', function(done) {
        (true).should.be.exactly(true);
        setTimeout(function() {
            console.log('Waiting...');
            return done();
        }, 7000);
    });

    it('should connect to MongoDB', function(done) {
        // disable timeout for this suite
        this.timeout(0);

        var isConnected = function(){
            console.log('isConnected', mongoose.connection.readyState);
            (mongoose.connection.readyState).should.be.exactly(mongoose.STATES['connected']);
            return done();
        };

        console.log('mongoose.STATES', mongoose.STATES);
        console.log('mongoose.connection.readyState', mongoose.connection.readyState);

        if (mongoose.connection.readyState === mongoose.STATES['connected']) {
            return isConnected();
        }
        else {
            mongoose.connection.on('fullsetup', function() {
                console.log('mongoose.connection.on fullsetup');
                // cloudbuild cluster test
                return isConnected();
            });
            mongoose.connection.on('error', function(err) {
                console.log('mongoose.connection.on error', err);
                return isConnected();
            });
            mongoose.connection.on('connecting', function() {
                console.log('mongoose.connection.on connecting');
            });
            mongoose.connection.on('connected', function() {
                console.log('mongoose.connection.on connected');

                // localhost dev test
                if (isLocalhost()) {
                    return isConnected();
                }
            });
            mongoose.connection.on('disconnecting', function() {
                console.log('mongoose.connection.on disconnecting');
            });
            mongoose.connection.on('disconnected', function() {
                console.log('mongoose.connection.on disconnected');
            });
            mongoose.connection.on('close', function() {
                console.log('mongoose.connection.on close');
            });
            mongoose.connection.on('reconnected', function() {
                console.log('mongoose.connection.on reconnected');
            });
            mongoose.connection.on('all', function() {
                console.log('mongoose.connection.on all');
            });
            mongoose.connection.on('reconnectFailed', function() {
                console.log('mongoose.connection.on reconnectFailed');
            });

            setTimeout(function() {
                if (isLocalhost()) {
                    // do nothing on localhost
                }
                else {
                    console.log('mongoose no fullsetup event, progressing...');
                    return isConnected();
                }
            }, 60 * 1000);
        }
    });

    after(function(done) {
        setTimeout(function() {
            console.log('Starting app tests...');
            return done();
        }, 5000);
    });
});
