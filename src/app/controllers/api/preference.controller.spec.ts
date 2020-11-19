// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { PreferenceController } from './preference.controller';

describe('PreferenceController', () => {

  let controller: PreferenceController;

  beforeEach(() => controller = createController(PreferenceController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(PreferenceController, 'foo'), 'GET');
      strictEqual(getPath(PreferenceController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
