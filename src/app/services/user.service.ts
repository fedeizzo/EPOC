// 3p
import { Config, hashPassword } from '@foal/core';
import { isCommon } from '@foal/password'
import { connect, disconnect } from 'mongoose';

// App
import { User } from '../models'

export class UserService {
  /**
   * Insert a user into the database
   * @returns 0 for no error, 1 for common password error, 2 for db error
   */
  async insertUser(firstName: string, email: string, username: string, password: string, secondName?: string): Promise<number> {
    let returnCode: number = 0; // no error

    if (await isCommon(password)) {
      returnCode = 1;
    } else {
      const uri = Config.getOrThrow('mongodb.uri', 'string');
      await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

      const user = new User();
      user.firstName = firstName;
      user.secondName = secondName;
      user.email = email;
      user.username = username;
      user.password = await (hashPassword(password));

      try {
        await user.save();
      } catch (error) {
        returnCode = 2; // db error
        console.error(error.message);
      }

      await disconnect();
    }
    return returnCode;
  }
}
