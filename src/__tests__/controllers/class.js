import { route, RPC, before, after } from '../../..';

import {
  beforeMiddleware1,
  beforeMiddleware2,
  invokerMiddleware,
  afterMiddleware,
  composedMiddleware,
} from './middleware';

@route('/test.TestService')
@after(afterMiddleware)
export default class APIController {

  constructor({ config }) {
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  @route('/TestMethod')
  @RPC()
  @before([beforeMiddleware1, beforeMiddleware2])
  async testMethod(ctx) {
    ctx.body = "result";
  }

  @route('/TestMethod2')
  @RPC()
  @before([beforeMiddleware1])
  async testMethod2(ctx) {
    ctx.body = "result";
  }
}
