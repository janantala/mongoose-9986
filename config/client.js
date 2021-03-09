'use strict';


/**
 *  Request client methods
 */

module.exports.setTextContentType = function(client){
    client.headers['Content-type'] = 'text/plain';
    return client;
};

module.exports.setTextAccept = function(client){
    client.headers['Accept'] = 'text/plain';
    return client;
};

module.exports.setJsonContentType = function(client){
    client.headers['Content-type'] = 'application/json';
    return client;
};

module.exports.setJsonAccept = function(client){
    client.headers['Accept'] = 'application/json';
    return client;
};

