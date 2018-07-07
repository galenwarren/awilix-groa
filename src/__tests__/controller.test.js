import Router from 'groa-router';
import compose from 'koa-compose';
import { HttpVerbs } from 'awilix-router-core';

import {
	controller,
	loadControllers,
	createController,
	route,
	before,
	after,
	RPC
} from '..';

import {
	beforeMiddleware1,
	beforeMiddleware2,
	invokerMiddleware,
	afterMiddleware,
	composedMiddleware
} from './controllers/middleware';

import builderController from './controllers/builder';
import ClassController from './controllers/class';

import { makeInvoker } from '../invokers';

jest.mock('groa-router');
jest.mock('koa-compose');
jest.mock('../invokers');

describe('controller properly sets up routes', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('properly sets up routes', () => {
		const invoker = jest.fn();

		beforeEach(() => {
			compose.mockReturnValue(composedMiddleware);
			invoker.mockReturnValue(invokerMiddleware);
			makeInvoker.mockReturnValue(invoker);
		});

		function validate(makeInvokerTarget) {
			expect(Router).toHaveBeenCalledTimes(1);

			expect(makeInvoker).toHaveBeenCalledTimes(1);
			expect(makeInvoker.mock.calls[0]).toEqual([makeInvokerTarget]);

			expect(invoker).toHaveBeenCalledTimes(2);
			expect(invoker).toHaveBeenNthCalledWith(1, 'testMethod');
			expect(invoker).toHaveBeenNthCalledWith(2, 'testMethod2');

			expect(compose).toHaveBeenCalledTimes(2);
			expect(compose).toHaveBeenNthCalledWith(1, [
				beforeMiddleware1,
				beforeMiddleware2,
				invokerMiddleware,
				afterMiddleware
			]);
			expect(compose).toHaveBeenNthCalledWith(2, [
				beforeMiddleware1,
				invokerMiddleware,
				afterMiddleware
			]);

			const mockRouter = Router.mock.instances[0];

			expect(mockRouter.rpc).toHaveBeenCalledTimes(2);
			expect(mockRouter.rpc).toHaveBeenNthCalledWith(
				1,
				'/test.TestService/TestMethod',
				composedMiddleware
			);
			expect(mockRouter.rpc).toHaveBeenNthCalledWith(
				2,
				'/test.TestService/TestMethod2',
				composedMiddleware
			);

			expect(mockRouter.routes).toHaveBeenCalledTimes(1);
		}

		test('with explicit builder controller', () => {
			// this can be supplied either as an array or a single controller
			// use an array here to get code coverage of both paths
			controller([builderController]);

			validate(builderController.target);
		});

		test('with explicit class controller', () => {
			// this can be supplied either as an array or a single controller
			// use a single value here to get code coverage of both paths
			controller(ClassController);

			validate(ClassController);
		});

		test('with loaded builder controller', () => {
			loadControllers('controllers/builder.js', { cwd: __dirname });

			validate(builderController.target);
		});

		test('with loaded class controller', () => {
			loadControllers('controllers/class.js', { cwd: __dirname });

			validate(ClassController);
		});
	});

	test('builder http verbs are blocked', () => {
		const controller = createController(() => ({}));

		Object.keys(HttpVerbs).forEach(verb => {
			expect(() => {
				controller[verb.toLowerCase()]();
			}).toThrow('is not a function');
		});
	});
});
