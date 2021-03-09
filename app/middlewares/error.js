'use strict';

var errors = require('./../libs/errors.js');

module.exports = function() {
    return function(err, req, res, next){

        if (!err) {
            return next();
        }

        if (process.env.NODE_ENV === 'development') {
            // Log it
            console.error(err);
        }

        if (err instanceof errors.HttpResponseError) {
            return res.status(err.status).send({
                type: err.name || 'HttpResponseError',
                message: err.message
            });
        }

        else if (err instanceof Error) {
            var errorResponse = {
                type: err.name || 'Error',
                message: errors.getErrorMessage(err) || 'Something went wrong',
                errors: err.errors
            };

            return res.status(400).send(errorResponse);
        }
    };
};
