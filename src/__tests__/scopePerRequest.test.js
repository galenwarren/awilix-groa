import { createContainer } from 'awilix';
import { scopePerRequest } from '../scopePerRequest';

describe('scopePerRequest', () => {

  const scope = {
    dispose: jest.fn(),
  };

  const container = {
    createScope: jest.fn(() => scope),
  };

  let context;

  const next = jest.fn(async () => {
    expect(context.state.container).toEqual(scope);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    context = null;
  });

  function validate() {
    expect(container.createScope).toHaveBeenCalledTimes(1);
    expect(scope.dispose).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  }

  it('should properly create/destroy container with no preexisting context.state', async () => {
    const middleware = scopePerRequest(container);
    context = {};
    await middleware(context, next);
    validate();
  });

  it('should properly create/destroy container with context.state', async () => {
    const middleware = scopePerRequest(container);
    context = { state: {} };
    await middleware(context, next);
    validate();
  });

  it('should properly create/destroy container when error occurs in next()', () => {

    const error = new Error();
    const middleware = scopePerRequest(container);
    context = { state: {} };

    expect(middleware(context, async () => {
      throw error;
    })).rejects.toEqual(error);

  });

});
