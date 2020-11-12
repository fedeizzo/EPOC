import { Config, createService } from '@foal/core';
import { strictEqual } from 'assert';
import { UserService } from './user.service';
import { connection, connect, disconnect } from 'mongoose';

describe("The User Service", () => {
  const userService: UserService = createService(UserService);

  afterEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    await connection.db.dropCollection('userclasses');
    await disconnect();
  });

  describe('insertUser', () => {
    describe('When the password is to common', () => {
      it('returns a bad response with error code 300', async () => {
        const expectedErrorCode = 300;
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
        const expectedErrorCode = 200;
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
      it('returns a bad response with error code 301', async () => {
        const expectedErrorCode = 200;
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const email2 = "test";
        const username = "test";
        const password = "qqweupodfsksjfd232@";
        await userService.insertUser(firstName, email, username, password, secondName);
        const actualErrorCode = await userService.insertUser(firstName, email2, username, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When email already exists', () => {
      it('returns a bad response with error code 301', async () => {
        const expectedErrorCode = 200;
        const firstName = "test";
        const secondName = "test";
        const email = "test";
        const username = "test";
        const username2 = "test";
        const password = "qqweupodfsksjfd232@";
        await userService.insertUser(firstName, email, username, password, secondName);
        const actualErrorCode = await userService.insertUser(firstName, email, username2, password, secondName);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
  });

  describe('areValidCredentials', () => {
    beforeEach(async () => {
      const firstName = "test";
      const secondName = "test";
      const email = "test";
      const username = "test";
      const password = "qqweupodfsksjfd232@";
      await userService.insertUser(firstName, email, username, password, secondName);
    });
    describe('When credentials are right', () => {
      it('returns a good response with code 200 and the user instance', async () => {
        const expectedErrorCode = 200;
        const username = "test";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When password is wrong', () => {
      it('returns a bad response with code 302', async () => {
        const expectedErrorCode = 302;
        const username = "test";
        const password = "ciao";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
    describe('When username is wrong', () => {
      it('returns a bad response with code 303', async () => {
        const expectedErrorCode = 303;
        const username = "ciao";
        const password = "qqweupodfsksjfd232@";
        const actualErrorCode = await userService.areValidCredentials(username, password);
        strictEqual(expectedErrorCode, actualErrorCode.code);
      });
    });
  });
});

