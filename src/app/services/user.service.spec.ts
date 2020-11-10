import { Config, createService } from '@foal/core';
import { strictEqual } from 'assert';
import { connect, connection, disconnect } from 'mongoose';
import { UserService } from './user.service';

describe("The User Service", () => {
  it('should insert correctly a user in the db', async () => {
    const service = createService(UserService);
    const expectedReturnCode = 200;
    const actualReturnCode = await service.insertUser(
      'Mario',
      'mario@rossi32.it',
      "mario12332",
      "sfcseckjnweuhc234325"
    );

    strictEqual(actualReturnCode.code, expectedReturnCode);
  });

  // Note: we can't drop the 
  it('should deny inserting a user with a common password', async () => {
    const service = createService(UserService);
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
    const service = createService(UserService);
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

  after(async () => {
    const uri = Config.getOrThrow('mongodb.uri', 'string');
    await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

    await connection.db.dropCollection('userclasses');
    let a;
    await disconnect();
  });
});

