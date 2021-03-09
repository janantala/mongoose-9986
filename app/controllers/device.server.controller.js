'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Device = mongoose.model('Device');
var errors = require('./../libs/errors.js');

exports.query = function(req, res, next) {
  mongoose.model('Device').find(req.query || {}).lean({defaults: true, getters: true, virtuals: true}).exec(function(err, devices) {
    if (err) {
      console.log('err', err);
      return next(err);
    }
    res.json(devices);
  });
};

exports.search = function(req, res, next) {
    mongoose.model('Device').find(req.body || {}).lean({defaults: true, getters: true, virtuals: true}).exec(function(err, devices) {
      if (err) {
            return next(err);
        }
        res.json(devices);
    });
};

exports.create = function(req, res, next) {
  var device = new Device(req.body);

  device.save(function(err, device) {
    if (err) {
      return next(err);
    } else {
      res.json(device);
    }
  });
};

exports.read = function(req, res, next) {
  res.json(req.device);
};

exports.deviceById = function(req, res, next, deviceId) {
  if (!mongoose.Types.ObjectId.isValid(deviceId)) {
    return next(new errors.HttpResponseError('Device is invalid ' + deviceId));
  }

  mongoose.model('Device').findById(deviceId, function(err, device) {
    if (err) {
      return next(err);
    }
    if (!device) {
      return next(new errors.NotFound('Device not found ' + deviceId));
    }
    req.device = device;
    return next();
  });
};
