// 3p
import { Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';

// App
import { User } from '../app/models'

export const schema = {
  additionalProperties: false,
  properties: {
    firstName: {
      type: 'string'
    },
    secondName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['firstName', 'secondName', 'email', 'username', 'password'],
  unique: ['email', 'username'],
  type: 'object',
};

export async function main(args: any) {
  const uri = Config.getOrThrow('mongodb.uri', 'string');
  await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  const user  = new User();
  user.firstName = args.firstName;
  user.secondName = args.secondName;
  user.email = args.email;
  user.username = args.username;
  await user.setPassword(args.password);

  try {
    console.log(await user.save())
  } catch (error) {
    console.error(error.message);
  } finally {
    await disconnect();
  }
}
