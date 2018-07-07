import { createController } from '../..';

import {
	beforeMiddleware1,
	beforeMiddleware2,
	invokerMiddleware,
	afterMiddleware,
	composedMiddleware
} from './middleware';

const api = ({ config }) => ({
	getConfig() {
		return config;
	},

	async testMethod(ctx) {
		ctx.body = 'result';
	},

	async testMethod2(ctx) {
		ctx.body = 'result';
	}
});

export default createController(api)
	.prefix('/test.TestService')
	.rpc('/TestMethod', 'testMethod', {
		before: [beforeMiddleware1, beforeMiddleware2]
	})
	.rpc('/TestMethod2', 'testMethod2', {
		before: [beforeMiddleware1]
	})
	.after(afterMiddleware);
