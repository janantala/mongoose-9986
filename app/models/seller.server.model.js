'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Seller Schema
 */
var SellerSchema = new Schema({
    name: {
        type: String,
        index: true,
        trim: true,
        required: 'Name is required'
    }
});

SellerSchema.statics.getSeller = function(name, cb) {
    mongoose.model('Seller').findOne({'name': name}, function(err, spot){
        return cb(err, spot);
    });
};
mongoose.model('Seller', SellerSchema);
