import { asFunction, asClass } from 'awilix';

import { isClass } from 'awilix/lib/utils';

export function makeInvoker(funcOrClass, options = {}) {
	return isClass(funcOrClass)
		? makeClassInvoker(funcOrClass, options)
		: makeFunctionInvoker(funcOrClass, options);
}

export function makeFunctionInvoker(func, options = {}) {
	return makeResolverInvoker(asFunction(func, options));
}

export function makeClassInvoker(Class, options = {}) {
	return makeResolverInvoker(asClass(Class, options));
}

export function makeResolverInvoker(resolver) {
	return methodToInvoke => (ctx, ...args) => {
		const container = ctx.state.container;
		const resolved = container.build(resolver);
		return resolved[methodToInvoke](ctx, ...args);
	};
}
