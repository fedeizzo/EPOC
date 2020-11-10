import { Context, Get, Post, ValidateBody, HttpResponseNotFound, render, HttpResponseRedirect, HttpResponseBadRequest } from '@foal/core';

// App
import { UserService, Response } from '../services';

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
  private userService: UserService = new UserService();

  @Get('/signup')
  async showSignupForm(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/signup.html');
  }

  @Post('/signup')
  @ValidateBody(signupSchema)
  async signup(ctx: Context) {
    const firstName = ctx.request.body.firstName;
    const secondName = ctx.request.body.secondName;
    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const response: Response = await this.userService.insertUser(firstName, email, username, password, secondName);

    if (response.code === 200) {
      return new HttpResponseRedirect('/');
    } else {
      return new HttpResponseBadRequest(response.buildResponse());
    }
  }

}
