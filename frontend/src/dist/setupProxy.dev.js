"use strict";

var _require = require('http-proxy-middleware'),
    createProxyMiddleware = _require.createProxyMiddleware;

module.exports = function (app) {
  app.use('/', createProxyMiddleware({
    target: 'https://animalcaredb-3c73ac350ab8.herokuapp.com',
    changeOrigin: true,
    logLevel: 'debug'
  }));
};