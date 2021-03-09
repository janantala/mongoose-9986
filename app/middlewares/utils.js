'use strict';

var errors = require('./../libs/errors.js');

exports.acceptsJson = function(req, res, next) {

    if (! req.accepts('application/json')) {
        return next(new errors.NotAcceptable());
    }

    return next();
};

exports.isJson = function(req, res, next) {

    if (! req.is('application/json')) {
        return next(new errors.UnsupportedMediaType());
    }

    return next();
};

