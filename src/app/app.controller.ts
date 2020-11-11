import { controller } from '@foal/core';

import { AuthenticationController } from './controllers';

export class AppController {
  subControllers = [
    controller('/', AuthenticationController),
  ];
}
