import { controller } from '@foal/core';

import { ApiController, UserController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/', UserController),
  ];
}
