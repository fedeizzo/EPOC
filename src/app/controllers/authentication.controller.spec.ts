import { ok, strictEqual } from 'assert';
import { getHttpMethod, getPath, Context, createController, isHttpResponseOK, Config } from '@foal/core';
import { AuthenticationController } from './authentication.controller';
import { connection, connect, disconnect } from 'mongoose';

describe('The Authentication Controller', () => {
  const controller: AuthenticationController = createController(AuthenticationController);

  // afterEach(async () => {
  //   await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  //   await connection.db.dropCollection('userclasses');
  //   await disconnect();
  // });

  describe('signup', () => {
    describe('When request accepts html', () => {
      it('returns the signup html page', async () => {
      });
    });
    describe('When request does not accept html', () => {
      it('returns not found error', async () => {
      });
    });
  });

  describe('signupCheck', () => {
    describe('When request accepts html', () => {
      it('returns the signup html page', async () => {
      });
    });
    describe('When request does not accept html', () => {
      it('returns not found error', async () => {
      });
    });
  });

  describe('login', () => {
    describe('When request accepts html', () => {
      it('returns the signup html page', async () => {
        strictEqual(getHttpMethod(AuthenticationController, 'login'), 'GET');
        strictEqual(getPath(AuthenticationController, 'login'), '/login')
      });
    });
    describe('When request does not accept html', () => {
      it('returns not found error', async () => {
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
      it('returns a redirect to home page with status code 302', async () => {
        const ctx = new Context({ user: 'ciao' });
        strictEqual(getHttpMethod(AuthenticationController, 'logout'), 'POST');
        strictEqual(getPath(AuthenticationController, 'logout'), '/logout');
        strictEqual(getPath(AuthenticationController, 'logout'), '/logout');
        strictEqual((await controller.logout(ctx)).statusCode, 302);
      });
    });
    describe('When JWT is not set', () => {
      it('returns not found error with status code 404', async () => {
      });
    });
  });
});
