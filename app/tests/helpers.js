'use strict';

const mongoose = require('mongoose');
const async = require('async');

module.exports.wipeDatabase = function(cb) {

    mongoose.connection.db.collections(function(err, collections) {
        if (err) {
            return cb(err);
        }

        async.eachSeries(collections, function(collection, cb2) {
                return collection.deleteOne(function(err) {
                    return cb2(err);
                });
            }, function(err) {
                return cb(err);
            }
        );
    });

};

module.exports.isLocalhost = function() {
    return process.env.MONGODB_URL.indexOf('localhost') > -1 || process.env.MONGODB_URL.indexOf('127.0.0.1') > -1;
};

