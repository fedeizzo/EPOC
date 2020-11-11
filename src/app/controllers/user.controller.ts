import { Context, Get, Post, ValidateBody, HttpResponseNotFound, render, HttpResponseRedirect, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';

// App
import { UserService, ServiceResponse } from '../services';

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

const loginSchema = {
  properites: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
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
    const response: ServiceResponse = await this.userService.insertUser(firstName, email, username, password, secondName);

    if (response.code === 200) {
      return new HttpResponseRedirect('/');
    } else {
      return new HttpResponseBadRequest(response.buildResponse());
    }
  }

  @Post('/login')
  @ValidateBody(loginSchema)
  async login(ctx: Context) {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const response: ServiceResponse = await this.userService.areValidCredentials(username, password);

    if (response.code === 200) {
      return new HttpResponseOK(response.buildResponse());
    } else {
      return new HttpResponseBadRequest(response.buildResponse());
    }
  }

}
