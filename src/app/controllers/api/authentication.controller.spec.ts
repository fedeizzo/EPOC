import { spy, anything, when } from 'ts-mockito';
import { deepEqual } from 'assert';
import { Context, createController, Config } from '@foal/core';
import { AuthenticationController } from './authentication.controller';
import { connection, connect, disconnect } from 'mongoose';
import { HttpResponseOK, HttpResponseForbidden, HttpResponseConflict, HttpResponseBadRequest } from '@foal/core';
import { User } from '../../models';

describe('The Authentication Controller', () => {
  const controller: AuthenticationController = createController(AuthenticationController);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await User.syncIndexes();
    await disconnect();
  });

  afterEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
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
    describe('When request accepts html', () => {
      it('returns the signup html page', async () => {
      });
    });
    describe('When request does not accept html', () => {
      it('returns not found error', async () => {
      });
    });
  });

  describe('logout', () => {
    describe('When JWT is set', () => {
      it('returns ok response', async () => {
        const ctx = new Context({ user: 'ciao' });
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
});
