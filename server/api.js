require('dotenv').config();

const express = require('express');
const fs = require('fs');
const https = require('https');
const { resolve } = require('path');

const proxy = require('http-proxy-middleware');
const app = express();

const {
  API_ENDPOINT,
  STORAGE_ENDPOINT,
  SOCKET_ENDPOINT,
  CHAT_ENDPOINT,
  AD_SERVER_ENDPOINT,
  GEO_SERVER_ENDPOINT,
  API_PORT,
} = process.env;

const options = {
  ca: [
    fs.readFileSync(resolve(__dirname, './cert/rootca.crt')),
    fs.readFileSync(resolve(__dirname, './cert/intermediate1.crt')),
  ],
  key: fs.readFileSync(resolve(__dirname, './cert/server.key')),
  cert: fs.readFileSync(resolve(__dirname, './cert/server.crt')),
};

if (GEO_SERVER_ENDPOINT) {
  app.use(
    proxy('/api/geo/direction/', {
      target: GEO_SERVER_ENDPOINT,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '/api/geo/direction/': '/direction',
      },
    }),
  );
}

if (CHAT_ENDPOINT) {
  app.use(
    proxy('/chat/', {
      target: CHAT_ENDPOINT,
      ws: true,
      changeOrigin: true,
      secure: false,
    }),
  );
}

if (SOCKET_ENDPOINT) {
  app.use(
    proxy('/socket.io', {
      target: SOCKET_ENDPOINT,
      ws: true,
      changeOrigin: true,
      secure: false,
    }),
  );
}

app.use(
  proxy('/api/v1/ad', {
    target: AD_SERVER_ENDPOINT || API_ENDPOINT,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path) => path,
    // onProxyReq(proxyReq, req, res) {
    //   const token = prepareToken();
    //   proxyReq.setHeader('Authorization', `Bearer ${token}`);
    // },
  }),
);

// 广告权限
app.use(
  proxy('/api/admin/v1', {
    target: AD_SERVER_ENDPOINT || API_ENDPOINT,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path) => path,
  }),
);
//

// 广告支付api
app.use(
  proxy('/api/payment', {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
    pathRewrite: (path) => path,
  }),
);
//

app.use(
  proxy('/api', {
    target: API_ENDPOINT,
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req) => {
      console.log(`[${req.method}] ${req.url}`);
      // console.log(req.headers);
    },
  }),
);

if (STORAGE_ENDPOINT) {
  app.use(
    proxy('/media', {
      target: STORAGE_ENDPOINT,
      changeOrigin: true,
      secure: false,
    }),
  );
}

https.createServer(options, app).listen(API_PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err.message);
  }
  // Connect to ngrok in dev mode
  console.log('Listening port: ', API_PORT);
});
