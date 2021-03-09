'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongooseLeanDefaults = require('mongoose-lean-defaults');
const mongooseLeanGetters = require('mongoose-lean-getters');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
    seller_id: {
        type: Schema.ObjectId,
        ref: 'Seller',
        required: 'Seller is required',
        validate: {
            validator: function(value) {
                return new Promise(function(resolve, reject){
                    mongoose.model('Seller').findOne(value, function (err, seller) {
                        if (err || !seller) {
                            return resolve(false);
                        } else {
                            return resolve(true);
                        }
                    });
                });
            },
            message: 'Seller is invalid'
        }
    },
    type: {
        type: String,
        index: true,
        trim: true,
        required: 'Type is required'
    },
    model: {
        type: String,
        index: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    last_seen: {
        type: Date
    },
    sn: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true }
    },
    uuid: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true }
    },
    monitoring: {
        status: {
            type: String,
            enum: ['unknown', 'ok', 'suspicious', 'outage'],
            default: 'unknown'
        },
        last_data_at: {
            type: Date,
            default: null
        },
        last_heartbeat_at: {
            type: Date,
            default: null
        },
        last_ips: {
            type: [String],
            default: []
        }
    }
}, {
    id: false,
    toObject: {
        getters: true,
        virtuals: true
    },
    toJSON: {
        getters: true,
        virtuals: true
    }
});

DeviceSchema.plugin(mongooseLeanDefaults);
DeviceSchema.plugin(mongooseLeanGetters);
DeviceSchema.plugin(mongooseLeanVirtuals);

mongoose.model('Device', DeviceSchema);
