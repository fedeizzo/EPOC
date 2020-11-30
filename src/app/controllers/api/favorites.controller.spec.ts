// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { FavoritesController } from './favorites.controller';

describe('FavoritesController', () => {

  let controller: FavoritesController;

  beforeEach(() => controller = createController(FavoritesController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(FavoritesController, 'foo'), 'GET');
      strictEqual(getPath(FavoritesController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
