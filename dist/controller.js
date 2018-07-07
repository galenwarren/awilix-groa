'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RPC = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.controller = controller;
exports.loadControllers = loadControllers;
exports.createController = createController;

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _groaRouter = require('groa-router');

var _groaRouter2 = _interopRequireDefault(_groaRouter);

var _awilixRouterCore = require('awilix-router-core');

var _invokers = require('./invokers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerController(router, { state, target }) {
  const invoker = (0, _invokers.makeInvoker)(target);
  const rolledUpState = (0, _awilixRouterCore.rollUpState)(state);
  rolledUpState.forEach((methodConfig, methodName) => {
    methodConfig.verbs.forEach(verb => {
      // the verb should always be *
      if (verb !== '*') {
        throw new Error(`Expected verb *, found ${verb}`);
      }

      // register the rpc route for each path
      methodConfig.paths.forEach(path => {

        const composed = (0, _koaCompose2.default)([...methodConfig.beforeMiddleware, invoker(methodName), ...methodConfig.afterMiddleware]);

        router.rpc(path, composed);
      });
    });
  });
}

// reuse the ALL decorator to indicate an RPC method
const RPC = exports.RPC = _awilixRouterCore.ALL;

function controller(controllerClass) {
  const router = new _groaRouter2.default();

  const controllerClasses = Array.isArray(controllerClass) ? controllerClass : [controllerClass];

  controllerClasses.forEach(controllerClass => registerController(router, getStateAndTarget(controllerClass)));
}

function loadControllers(pattern, opts) {
  const router = new _groaRouter2.default();

  (0, _awilixRouterCore.findControllers)(pattern, _extends({}, opts, {
    absolute: true
  })).forEach(stateAndTarget => registerController(router, stateAndTarget));

  return router.routes();
}

function createController(...args) {
  const httpController = (0, _awilixRouterCore.createController)(...args);

  function createMethod(name) {
    return function (...args) {
      httpController[name](...args);
      return this;
    };
  }

  return {
    rpc: createMethod('all'),
    prefix: createMethod('prefix'),
    before: createMethod('before'),
    after: createMethod('after')
  };
}