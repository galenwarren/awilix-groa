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

const httpVerbs = new Set(Object.keys(_awilixRouterCore.HttpVerbs).map(v => v.toLowerCase()));

function registerController(router, { state, target }) {
	const invoker = (0, _invokers.makeInvoker)(target);
	const rolledUpState = (0, _awilixRouterCore.rollUpState)(state);
	rolledUpState.forEach((methodConfig, methodName) => {
		// register the rpc route for each path
		methodConfig.paths.forEach(path => {
			const composed = (0, _koaCompose2.default)([...methodConfig.beforeMiddleware, invoker(methodName), ...methodConfig.afterMiddleware]);

			router.rpc(path, composed);
		});
	});
}

// reuse the ALL decorator to indicate an RPC method
const RPC = exports.RPC = _awilixRouterCore.ALL;

function controller(controller) {
	const router = new _groaRouter2.default();

	const controllers = Array.isArray(controller) ? controller : [controller];

	controllers.forEach(controller => registerController(router, (0, _awilixRouterCore.getStateAndTarget)(controller)));

	return router.routes();
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

	function createBuilderMethod(target, methodName, targetMethodName) {
		return function (...args) {
			const builder = target[targetMethodName || methodName](...args);
			return new Proxy(builder, handler);
		};
	}

	const handler = {
		get(target, propKey) {
			switch (propKey) {
				case 'rpc':
					// map rpc to all, via proxy
					return createBuilderMethod(target, propKey, 'all');
				case 'prefix':
				case 'before':
				case 'after':
					// expose these methods, via proxy
					return createBuilderMethod(target, propKey);
				default:
					if (httpVerbs.has(propKey)) {
						// hide the builder methods that are http specific
						return null;
					} else {
						return target[propKey];
					}
			}
		}
	};

	return new Proxy(httpController, handler);
}