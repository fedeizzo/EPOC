import { Config, createService } from '@foal/core';
import { strictEqual } from 'assert';
import { connect, connection, disconnect } from 'mongoose';
import { UserService } from './user.service';

describe("The User Service", () => {
  describe('Check user insertion', () => {
    it('should insert correctly a user in the db', async () => {
      const service: UserService = createService(UserService);
      const expectedReturnCode = 200;
      const actualReturnCode = await service.insertUser(
        'Mario',
        'mario@rossi32.it',
        "mario12332",
        "sfcseckjnweuhc234325"
      );

      strictEqual(actualReturnCode.code, expectedReturnCode);
    });

    it('should deny inserting a user with a common password', async () => {
      const service: UserService = createService(UserService);
      const expectedReturnCode = 300;
      const actualReturnCode = await service.insertUser(
        'Mario',
        'mario@rossis.it',
        "mario123ds",
        "password"
      );

      strictEqual(actualReturnCode.code, expectedReturnCode);
    });

    it('should deny inserting two user with the same username', async () => {
      const service: UserService = createService(UserService);
      const expectedReturnCodeFirstUser = 200;
      const expectedReturnCodeSecondUser = 301;

      const actualReturnCodeFirstUser = await service.insertUser(
        'Mario',
        'mario@rossi.it',
        "mario123",
        "sfcseckjnweuhc2343f25"
      );

      const actualReturnCodeSecondUser = await service.insertUser(
        'Mario',
        'mario@rossi.it',
        "mario123",
        "fakjdhaefhvg384623407v9"
      );

      strictEqual(actualReturnCodeFirstUser.code, expectedReturnCodeFirstUser);
      strictEqual(actualReturnCodeSecondUser.code, expectedReturnCodeSecondUser);
    });
  });

  describe('Check user credentials', () => {
    it('should verify that user credentials are correct', async () => {
      const service: UserService = createService(UserService);
      const username = "tizio.caio.123";
      const password = "sdwwvrvgwer436";
      const userResponse = await service.insertUser(
        'Tizio',
        'tizio@rossi.it',
        username,
        password
      );

      const expectedReturnCode = 200;
      const actualResponse = await service.areValidCredentials(username, password);
      strictEqual(actualResponse.code, expectedReturnCode);
    });

    it('should verify that user credentials are wrong', async () => {
      const service: UserService = createService(UserService);
      const username = "tizio.caio.123";
      const password = "sdwwvrvgwer436";
      const wrongPassword = "sdwwvrvgwer416"
      const userResponse = await service.insertUser(
        'Tizio',
        'tizio@rossi.it',
        username,
        password
      );

      const expectedReturnCode = 302;
      const actualResponse = await service.areValidCredentials(username, wrongPassword);
      strictEqual(actualResponse.code, expectedReturnCode);
    });

    it('should verify that user is not in the db', async () => {
      const service: UserService = createService(UserService);
      const expectedReturnCode = 303;
      const actualResponse = await service.areValidCredentials('user-not-in-db', 'test');
      strictEqual(actualResponse.code, expectedReturnCode);
    });
  });

  after(async () => {
    const uri: string = Config.getOrThrow('mongodb.uri', 'string');
    await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    await connection.db.dropCollection('userclasses');
    await disconnect();
  });
});

