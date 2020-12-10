import { Config, createService } from '@foal/core';
import { strictEqual } from 'assert';
import { UserService } from './user.service';
import { connection, connect, disconnect } from 'mongoose';
import { ServiceResponse, ServiceResponseCode } from './response.service';
import { User } from '../models';

describe("The User Service", () => {
  const userService: UserService = createService(UserService);

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


  describe('insertUser', () => {
    describe('When the password is to common', () => {
      it('returns a bad response with error code 300', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.passwordTooCommon;
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "test";
        const password = "123";
        const actualErrorCode = await userService.insertUser(firstName, email, username, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When user does not exist', () => {
      it('creates the user and returns a good response with code 200', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "test";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.insertUser(firstName, email, username, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When username already exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "test";
        const password = "qqweupodfsksjffewfd232@";
        await userService.insertUser(firstName, email, username, password, secondName);
      });
      it('returns a bad response with error code 301', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.duplicateKeyInDb;
        const firstName = "test";
        const secondName = "test";
        const email = "tefasfst";
        const username = "test";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.insertUser(firstName, email, username, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When email already exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "testf";
        const password = "qqweupodfsksjffewfd232@";
        await userService.insertUser(firstName, email, username, password, secondName);
      });
      it('returns a bad response with error code 301', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.duplicateKeyInDb;
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "testa";
        const password = "qqweupodfdqwsksjfd232@";
        const actualErrorCode = await userService.insertUser(firstName, email, username, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
  });

  describe('areValidCredentials', () => {
    beforeEach(async () => {
      await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
      const firstName = "test";
      const secondName = "test";
      const email = "test";
      const username = "test";
      const password = "qqweupodfsksjfd232@";
      await userService.insertUser(firstName, email, username, password, secondName);
    });
    describe('When credentials are right', () => {
      it('returns a good response with code 200 and the user instance', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When password is wrong', () => {
      it('returns a bad response with code 302', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.wrongCredentials;
        const username = "test";
        const password = "ciao";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When username is wrong', () => {
      it('returns a bad response with code 303', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = "ciao";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
  });

  describe('deleteUser', () => {
    beforeEach(async () => {
      const firstName = "user";
      const secondName = "test";
      const email = "test@gmail";
      const username = "test22";
      const password = "wfwefwoikjjnc9@";
      await userService.insertUser(firstName, email, username, password, secondName);
    });
    describe('When user has been deleted', () => {
      it('returns a good response with code 200 and the deleted user instance', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test22";
        const password = "wfwefwoikjjnc9@";
        const actualErrorCode = await userService.deleteUser(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });

  });
});

