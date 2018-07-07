import { createContainer, asValue } from 'awilix';
import { makeInvoker, makeClassInvoker, makeFunctionInvoker } from '..';

import builderController from './controllers/builder';
import ClassController from './controllers/class';

describe('invokers properly build and invoke method', () => {

  const config = {};
  const container = createContainer();
  const context = { state: { container } };

  container.register({
    config: asValue(config),
  });

  test('on function, explicit', () => {
    const invoker = makeFunctionInvoker(builderController.target);
    expect(invoker('getConfig')(context)).toEqual(config);
  });

  test('on class, explicit', () => {
    const invoker = makeClassInvoker(ClassController);
    expect(invoker('getConfig')(context)).toEqual(config);
  });

  test('on function, inferred', () => {
    const invoker = makeInvoker(builderController.target);
    expect(invoker('getConfig')(context)).toEqual(config);
  });

  test('on class, inferred', () => {
    // makeInvoker takes optional options param, pass it here for coverage
    const invoker = makeInvoker(ClassController, {});
    expect(invoker('getConfig')(context)).toEqual(config);
  });

});
