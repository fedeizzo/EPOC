import { Context, Get, Post, HttpResponseOK, ValidateBody } from '@foal/core';

// App
import { User, Response } from '../services';

const signupSchema = {
  properites: {
    firstName: { type: 'string' },
    secondName: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['firstName', 'email', 'username', 'password'],
  type: 'object'
}
export class UserController {
  private userService: User = new User();

  @Post('/signup')
  @ValidateBody(signupSchema)
  async signup(ctx: Context) {
    const firstName = ctx.request.body.firstName;
    const secondName = ctx.request.body.secondName;
    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const response: Response = await this.userService.insertUser(firstName, email, username, password, secondName);

    return new HttpResponseOK(response.buildResponse());
  }

}
