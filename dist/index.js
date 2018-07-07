'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awilixRouterCore = require('awilix-router-core');

Object.defineProperty(exports, 'route', {
  enumerable: true,
  get: function () {
    return _awilixRouterCore.route;
  }
});
Object.defineProperty(exports, 'before', {
  enumerable: true,
  get: function () {
    return _awilixRouterCore.before;
  }
});
Object.defineProperty(exports, 'after', {
  enumerable: true,
  get: function () {
    return _awilixRouterCore.after;
  }
});

var _scopePerRequest = require('./scopePerRequest');

Object.keys(_scopePerRequest).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _scopePerRequest[key];
    }
  });
});

var _controller = require('./controller');

Object.keys(_controller).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _controller[key];
    }
  });
});

var _invokers = require('./invokers');

Object.keys(_invokers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _invokers[key];
    }
  });
});