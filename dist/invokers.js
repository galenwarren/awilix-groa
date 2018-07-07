'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeInvoker = makeInvoker;
exports.makeFunctionInvoker = makeFunctionInvoker;
exports.makeClassInvoker = makeClassInvoker;
exports.makeResolverInvoker = makeResolverInvoker;

var _awilix = require('awilix');

var _utils = require('awilix/lib/utils');

function makeInvoker(funcOrClass, options = {}) {
  console.log(1, funcOrClass, (0, _utils.isClass)(funcOrClass));
  return (0, _utils.isClass)(funcOrClass) ? makeClassInvoker(funcOrClass, options) : makeFunctionInvoker(funcOrClass, options);
}

function makeFunctionInvoker(func, options = {}) {
  return makeResolverInvoker((0, _awilix.asFunction)(func, options));
}

function makeClassInvoker(Class, options = {}) {
  return makeResolverInvoker((0, _awilix.asClass)(Class), options);
}

function makeResolverInvoker(resolver) {
  return methodToInvoke => (ctx, ...args) => {
    const container = ctx.state.container;
    const resolved = container.build(resolver);
    return resolved[methodToInvoke](ctx, ...args);
  };
}
