import { spy, anything, when } from 'ts-mockito';
import { deepEqual } from 'assert';
import { Context, createController, Config, HttpResponse, HttpResponseNotFound, HttpResponseUnauthorized } from '@foal/core';
import { AuthenticationController } from './authentication.controller';
import { connection, connect, disconnect } from 'mongoose';
import { HttpResponseOK, HttpResponseForbidden, HttpResponseConflict, HttpResponseBadRequest } from '@foal/core';
import { User } from '../../models';
import { UserService } from '../../services';
import { emptyPrefs } from '../../models/preferences.model';

describe('The Authentication Controller', () => {
  const controller: AuthenticationController = createController(AuthenticationController);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await User.syncIndexes();
    // await disconnect();
  });

  afterEach(async () => {
    // await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    await connection.db.dropCollection('userclasses');
    await disconnect();
  });

  describe('signupCheck', () => {
    describe('When passed data is ok', () => {
      it('returns OK response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          firstName: "test",
          secondName: "test",
          email: "test@test.com",
          username: "test",
          password: "lkjdslvfsd",
        };
        const authResponse = {
          text: "OK",
          userInfo: {
            firstName: "test",
            secondName: "test",
            email: "test@test.com",
            username: "test"
          }
        };
        const expectedResponse = new HttpResponseOK(authResponse);
        const actualResponse = await controller.signupCheck(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When password passed is too common', () => {
      it('returns forbidden response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          firstName: "test",
          secondName: "test",
          email: "test@test.com",
          username: "test",
          password: "test",
        };
        const authResponse = {
          text: "Password too common",
          userInfo: ""
        };
        const expectedResponse = new HttpResponseForbidden(authResponse);
        const actualResponse = await controller.signupCheck(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When username or email are already used', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const ctx = new Context({});
        ctx.request.body = {
          firstName: "test",
          secondName: "test",
          email: "test@test.com",
          username: "test",
          password: "lkjdslvfsd",
        };
        await controller.signupCheck(ctx);
      })
      it('returns conflict response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          firstName: "test",
          secondName: "test",
          email: "test@test.com",
          username: "test",
          password: "lkjdslvfsd",
        };
        const authResponse = {
          text: "Db error, probably duplicate key",
          userInfo: ""
        };
        const expectedResponse = new HttpResponseConflict(authResponse);
        const actualResponse = await controller.signupCheck(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
  });

  describe('loginCheck', () => {
    describe('When passed data is ok', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test@test.com";
        const username = "test";
        const password = "lkjdslvfsd";
        const userService: UserService = new UserService();
        await userService.insertUser(
          firstName,
          email,
          username,
          password,
          emptyPrefs(),
          secondName);
      });
      it('returns OK response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          username: "test",
          password: "lkjdslvfsd"
        };
        const authResponse = {
          text: "User found, right credentials",
          userInfo: {
            firstName: "test",
            secondName: "test",
            email: "test@test.com",
            username: "test"
          }
        };

        const expectedResponse = new HttpResponseOK(authResponse);
        const actualResponse: HttpResponse = await controller.loginCheck(ctx);

        // use actual JWT cookie for expexted response
        const cookie = actualResponse.getCookie('JWT');
        expectedResponse.setCookie('JWT', cookie.value == undefined ? "" : cookie.value, cookie.options);

        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When user password is wrong', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test@test.com";
        const username = "test";
        const password = "lkjdslvfsd";
        const userService: UserService = new UserService();
        await userService.insertUser(
          firstName,
          email,
          username,
          password,
          emptyPrefs(),
          secondName);
      });
      it('returns 401 unauthorized response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          username: "test",
          password: "lkjdslvfsgf34d"
        };
        const authResponse = {
          text: "User found, wrong credentials",
          userInfo: ""
        };

        const expectedResponse = new HttpResponseUnauthorized(authResponse);
        const actualResponse: HttpResponse = await controller.loginCheck(ctx);

        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When user does not exists', () => {
      it('returns 404 element not found response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          username: "test2",
          password: "lkjdslvfsd"
        };
        const authResponse = {
          text: "User not found, probably",
          userInfo: ""
        };

        const expectedResponse = new HttpResponseNotFound(authResponse);
        const actualResponse: HttpResponse = await controller.loginCheck(ctx);

        deepEqual(actualResponse, expectedResponse);
      });
    });
  });

  describe('logout', () => {
    describe('When JWT is set', () => {
      it('returns ok response', async () => {
        const ctx = new Context({});
        ctx.user = { username: 'ciao' };
        const expectedResponse = new HttpResponseOK();
        expectedResponse.setCookie('JWT', '');
        const actualResponse = await controller.logout(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When JWT is not set', () => {
      it('returns bad request response', async () => {
        // const spiedController = spy(controller);
        // // const expectedResponse = new HttpResponseBadRequest();
        // const expectedResponse = new HttpResponseOK();
        // when(spiedController.logout(anything())).thenResolve(
        //   expectedResponse
        // );
      });
    });
  });

  describe('deleteUser', () => {
    describe('When JWT is set', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test@test.com";
        const username = "test";
        const password = "lkjdslvfsd";
        const userService: UserService = new UserService();
        await userService.insertUser(
          firstName,
          email,
          username,
          password,
          emptyPrefs(),
          secondName);
      });
      it('returns ok response', async () => {
        const ctx = new Context({});
        ctx.user = { username: 'test' };
        ctx.request.body = {
          username: "test",
          password: "lkjdslvfsd"
        };
        const authResponse = {
          text: "User deleted definitively",
          userInfo: {
            firstName: "test",
            secondName: "test",
            email: "test@test.com",
            username: "test"
          }
        };
        const expectedResponse = new HttpResponseOK(authResponse);
        const actualResponse = await controller.deleteUser(ctx);
        expectedResponse.setCookie('JWT', '');

        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When JWT does not match with user credentials', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test@test.com";
        const username = "test";
        const password = "lkjdslvfsd";
        const userService: UserService = new UserService();
        await userService.insertUser(
          firstName,
          email,
          username,
          password,
          emptyPrefs(),
          secondName);
      });
      it('returns 401 unauthorized response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test2" };
        ctx.request.body = {
          username: "test",
          password: "lkjdslvfsd"
        };
        const authResponse = {
          text: "User credentials do not match with your JWT"
        };

        const expectedResponse = new HttpResponseUnauthorized(authResponse);
        const actualResponse = await controller.deleteUser(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
    describe('When password is not correct', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test@test.com";
        const username = "test";
        const password = "lkjdslvfsd";
        const userService: UserService = new UserService();
        await userService.insertUser(
          firstName,
          email,
          username,
          password,
          emptyPrefs(),
          secondName);
      });
      it('returns 401 unauthorized response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.body = {
          username: "test",
          password: "lkjdsdsalvfsd"
        };

        const authResponse = {
          text: "User found, wrong credentials",
          userInfo: ""
        };

        const expectedResponse = new HttpResponseUnauthorized(authResponse);
        const actualResponse = await controller.deleteUser(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });
  });
});
