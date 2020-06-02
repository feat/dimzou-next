#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

/**
 * Module dependencies.
 */
require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./express');
const nextApp = require('./next');
const debug = require('./services/debug');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
// app.set('port', port)

let server;

if (process.env.HTTPS) {
  const options = {
    ca: [
      fs.readFileSync(path.resolve(__dirname, './cert/rootca.crt')),
      fs.readFileSync(path.resolve(__dirname, './cert/intermediate1.crt')),
    ],
    key: fs.readFileSync(path.resolve(__dirname, './cert/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, './cert/server.crt')),
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

// server.listen(port);
/**
 * Create HTTP server.
 */

nextApp.prepare().then(() => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.on('error', onError);
  server.on('listening', onListening);
  server.listen(port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug.server(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug.server(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug.server(`Server Schema: ${process.env.HTTPS ? 'https' : 'http'} `);
  debug.server(`Listening on ${bind}`);
}

// hack global logging
global.logging = global.console;
