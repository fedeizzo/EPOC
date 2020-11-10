// 3p
import { Config, hashPassword } from '@foal/core';
import { isCommon } from '@foal/password'
import { connect, disconnect } from 'mongoose';

// App
import { User } from '../models'
import { UserClass } from '../models/user.model';
import { Response } from '../services';

class ResponseUserService implements Response {
  code: number;
  text: string;
  prop?: UserClass;

  setValues = (code: number, text: string, prop?: UserClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  }

  buildResponse = () => {
    return {
      code: this.code,
      text: this.text,
      userInfo: this.prop ? this.prop.getInfo() : ""
    }
  }
}

export class UserService {
  private uri: string = Config.getOrThrow('mongodb.uri', 'string');

  async insertUser(firstName: string, email: string, username: string, password: string, secondName?: string): Promise<Response> {
    let response: ResponseUserService = new ResponseUserService();

    if (await isCommon(password)) {
      response.setValues(300, "Password too common");
    } else {
      await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

      const user = new User();
      user.firstName = firstName;
      user.secondName = secondName;
      user.email = email;
      user.username = username;
      user.password = await (hashPassword(password));

      try {
        await user.save();
        response.setValues(200, "OK", user);
      } catch (error) {
        response.setValues(301, "Db error, probably duplicate key");
        console.error(error.message);
      }

      await disconnect();
    }
    return response;
  }
}
