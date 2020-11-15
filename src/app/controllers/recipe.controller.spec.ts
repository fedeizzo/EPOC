// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { RecipeController } from './recipe.controller';

describe('RecipeController', () => {

  let controller: RecipeController;

  beforeEach(() => controller = createController(RecipeController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(RecipeController, 'foo'), 'GET');
      strictEqual(getPath(RecipeController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
