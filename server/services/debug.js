const common = require('debug')('dimzou-next:common');
const request = require('debug')('dimzou-next:request');
const auth = require('debug')('dimzou-next:auth');
const server = require('debug')('dimzou-next:server');
const redis = require('debug')('dimzou-next:redis');
const apiProxy = require('debug')('dimzou-next:api-proxy');
const socketProxy = require('debug')('dimzou-next:socket-proxy');

common.auth = auth;
common.request = request;
common.server = server;
common.redis = redis;
common.apiProxy = apiProxy;
common.socketProxy = socketProxy;

module.exports = common;
