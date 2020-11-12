import { ok, strictEqual } from 'assert';
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK, Config } from '@foal/core';
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
});
