import compose from 'koa-compose';
import Router from 'groa-router';

import {
	findControllers,
	getStateAndTarget,
	rollUpState,
	ALL,
	createController as createHttpController,
	HttpVerbs
} from 'awilix-router-core';

import { makeInvoker } from './invokers';

/**
 * The set of http verbs that are supported by awilix-router-core, these
 * are used below to ignore methods we don't support for grpc
 * @ignore
 */
const httpVerbs = new Set(Object.keys(HttpVerbs).map(v => v.toLowerCase()));

/**
 * Register routes on the provided router, using the state
 * and target information for a controller
 *
 * @ignore
 * @param  {Router} router         The groa router
 * @param  {Object} stateAndTarget The state and target information
 */
function registerController(router, stateAndTarget) {
	const { state, target } = stateAndTarget;
	const invoker = makeInvoker(target);
	const rolledUpState = rollUpState(state);
	rolledUpState.forEach((methodConfig, methodName) => {
		// register the rpc route for each path
		methodConfig.paths.forEach(path => {
			const composed = compose([
				...methodConfig.beforeMiddleware,
				invoker(methodName),
				...methodConfig.afterMiddleware
			]);

			router.rpc(path, composed);
		});
	});
}


/**
 * Decorator indicatoring an RPC method
 * @function
 * @param 	{String} path 				The route paths
 * @param		{Function} handler		The route handler
 */
export const RPC = ALL;

export function controller(controller) {
	const router = new Router();

	const controllers = Array.isArray(controller) ? controller : [controller];

	controllers.forEach(controller =>
		registerController(router, getStateAndTarget(controller))
	);

	return router.routes();
}

export function loadControllers(pattern, opts) {
	const router = new Router();

	findControllers(pattern, {
		...opts,
		absolute: true
	}).forEach(stateAndTarget => registerController(router, stateAndTarget));

	return router.routes();
}

export function createController(...args) {
	const httpController = createHttpController(...args);

	function createBuilderMethod(target, methodName, targetMethodName) {
		return function(...args) {
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
