import { Context, Get, HttpResponseOK } from '@foal/core';

export class BlacklistController {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
