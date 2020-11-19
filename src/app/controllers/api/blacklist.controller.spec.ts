// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { BlacklistController } from './blacklist.controller';

describe('BlacklistController', () => {

  let controller: BlacklistController;

  beforeEach(() => controller = createController(BlacklistController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(BlacklistController, 'foo'), 'GET');
      strictEqual(getPath(BlacklistController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
