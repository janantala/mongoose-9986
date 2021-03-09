'use strict';

var apiSellers = '/api/v1/sellers';
var apiDevices = '/api/v1/devices';

var getLocalhost = function() {
    var app = require('../server');
    return 'http://localhost:' + app.locals.port;
};

var buildPath = function(useLocalhost, fragments) {
    var path = useLocalhost ? getLocalhost() : '';
    fragments.forEach(function(fragment) {
        if (fragment) {
            path += fragment;
            if (path[path.length - 1] !== '/') {
                path += '/';
            }
        }
    });

    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1);
    }

    return path;
};

module.exports.getSellersUrl = function(id, useLocalhost) {
    return buildPath(useLocalhost, [apiSellers, id]);
};

module.exports.getDevicesUrl = function(id, useLocalhost) {
    return buildPath(useLocalhost, [apiDevices, id]);
};
