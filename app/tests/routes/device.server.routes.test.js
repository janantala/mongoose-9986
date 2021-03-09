'use strict';

/**
 * Module dependencies.
 */
var app = require('../../../server');
var should = require('should');
var request = require('request-json');
var mongoose = require('mongoose');

var pathsConfig = require('../../../config/paths');

const wipeDatabase = require('../helpers').wipeDatabase;

var Seller = mongoose.model('Seller');

/**
 * Globals
 */
var device;
var seller;
var client;

/**
 * Unit tests
 */
describe('Device REST API Tests:', function() {
    before(function(done) {
        wipeDatabase(function(err) {
            if (err) {
                return done(err);
            }

            seller = new Seller({
                name: 'BMW'
            });

            device = {
                type: 'car',
                model: 'device model',
                sn: '123456',
                uuid: '123456'
            };

            client = request.createClient(pathsConfig.getDevicesUrl(null, true));

            seller.save(function (err, s) {
                seller = s;
                device.seller_id = seller._id;
                done();
            });
        });
    });

    describe('Query', function() {

        var res;
        var devices;

        before(function(done) {
            client.get(pathsConfig.getDevicesUrl(null, true), function (error, response, body) {
                res = response;
                devices = body;
                done();
            });
        });

        it('should query devices', function(done) {
            (res.statusCode).should.be.exactly(200);
            done();
        });

        it('should return no devices', function(done) {
            (devices.length).should.be.exactly(0);
            done();
        });
    });


    describe('Create', function() {

        var res;
        var dev;

        before(function(done) {
            client.post(pathsConfig.getDevicesUrl(null, true), device, function (error, response, body) {
                res = response;
                dev = body;
                device = body;
                done();
            });
        });

        it('should create an device', function(done) {
            (res.statusCode).should.be.exactly(200);
            done();
        });

        it('should have attributes', function(done) {
            (dev.type).should.be.exactly('car');
            done();
        });

        it('should return devices', function(done) {
            client.get(pathsConfig.getDevicesUrl(null, true), function (error, response, body) {
                (body.length).should.be.exactly(1);
                done();
            });
        });
    });

    describe('Query with POST search API', function() {

        it('should return devices', function(done) {
            client.post(pathsConfig.getDevicesUrl('search', true), {}, function (error, response, body) {
                (response.statusCode).should.be.exactly(200);
                (body.length).should.be.exactly(1);
                done();
            });
        });
    });

    after(function(done) {
        return wipeDatabase(done);
    });
});

