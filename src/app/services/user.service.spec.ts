import { createService } from '@foal/core';
import { strictEqual } from 'assert';
import { UserService } from './user.service';

describe("The User Service", () => {
  it('should insert correctly a user in the db', async () => {
    const service = createService(UserService);
    const expectedReturnCode = 0;
    const actualReturnCode = await service.insertUser(
      'Mario',
      'mario@rossi.it',
      "mario123",
      "sfcseckjnweuhc234325"
    );

    strictEqual(actualReturnCode, expectedReturnCode);
  });

  it('should deny inserting a user with a common password', async () => {
    const service = createService(UserService);
    const expectedReturnCode = 1;
    const actualReturnCode = await service.insertUser(
      'Mario',
      'mario@rossi.it',
      "mario123",
      "password"
    );

    strictEqual(actualReturnCode, expectedReturnCode);
  });

  it('should deny inserting two user with the same username', async () => {
    const service = createService(UserService);
    const expectedReturnCodeFirstUser = 0;
    const expectedReturnCodeSecondUser = 2;

    const actualReturnCodeFirstUser = await service.insertUser(
      'Mario',
      'mario@rossi.it',
      "mario123",
      "sfcseckjnweuhc234325"
    );

    const actualReturnCodeSecondUser = await service.insertUser(
      'Luigi',
      'mario@rossi.it',
      "mario123",
      "fakjdhaefhvg3846234079"
    );

    // strictEqual(actualReturnCodeFirstUser, expectedReturnCodeFirstUser);
    strictEqual(actualReturnCodeSecondUser, expectedReturnCodeSecondUser);
  });

});

