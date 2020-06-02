const common = require('debug')('feat-web:common');
const request = require('debug')('feat-web:request');
const auth = require('debug')('feat-web:auth');
const server = require('debug')('feat-web:server');
const redis = require('debug')('feat-web:redis');
const apiProxy = require('debug')('proxy:api');
const socketProxy = require('debug')('proxy:socket');

common.auth = auth;
common.request = request;
common.server = server;
common.redis = redis;
common.apiProxy = apiProxy;
common.socketProxy = socketProxy;

module.exports = common;
