'use strict';

var util = require('util');

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
    var output;

    try {
        // var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        // output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
        output = 'Unique field already exists';

    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
                message = getUniqueErrorMessage(err);
                break;
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        if (err.errors) {
            for (var errName in err.errors) {
                if (err.errors[errName].message) {
                    message = err.errors[errName].message;
                }
            }
        }
        else {
            message = err.message;
        }
    }

    return message;
};


var AppError = function(message) {
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.name = this.constructor.name;
};
util.inherits(AppError, Error);


var HttpResponseError = function(message, statusCode, skipSentry = false) {
    this.status = statusCode || 400;
    this.skipSentry = skipSentry;
    AppError.call(this, message);
};
util.inherits(HttpResponseError, AppError);


var NotFound = function(message, skipSentry = false) {
    message = message || 'Not found.';
    HttpResponseError.call(this, message, 404, skipSentry);
};
util.inherits(NotFound, HttpResponseError);


var Forbidden = function(message) {
    message = message || 'Forbidden.';
    HttpResponseError.call(this, message, 403);
};
util.inherits(Forbidden, HttpResponseError);


var NotAcceptable = function(message) {
    message = message || 'Invalid format request.';
    HttpResponseError.call(this, message, 406);
};
util.inherits(NotAcceptable, HttpResponseError);


var UnsupportedMediaType = function(message) {
    message = message || 'Invalid data format.';
    HttpResponseError.call(this, message, 415);
};
util.inherits(UnsupportedMediaType, HttpResponseError);

var ValidationError = function(message) {
    message = message || 'Validation error.';
    HttpResponseError.call(this, message, 422, true);
};
util.inherits(ValidationError, HttpResponseError);


module.exports = {
    getErrorMessage,
    AppError,
    HttpResponseError,
    NotFound,
    Forbidden,
    NotAcceptable,
    UnsupportedMediaType,
    ValidationError
};
