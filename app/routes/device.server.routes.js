'use strict';

module.exports = function(app) {

    var pathsConfig = require('../../config/paths');
    var device = require('../../app/controllers/device');
    var utils = require('../../app/middlewares/utils');

    app.route(pathsConfig.getDevicesUrl()).get(utils.acceptsJson, device.query);
    app.route(pathsConfig.getDevicesUrl()).post(utils.acceptsJson, utils.isJson, device.create);
    app.route(pathsConfig.getDevicesUrl('search')).post(utils.acceptsJson, utils.isJson, device.search);
    app.route(pathsConfig.getDevicesUrl(':deviceId')).get(utils.acceptsJson, device.read);
    app.param('deviceId', device.deviceById);
};
