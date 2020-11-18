import { controller } from '@foal/core';
import { ApiController, PagesController } from "./controllers";
import { AuthenticationController } from './controllers';

export class AppController {
  subControllers = [
    controller('/', AuthenticationController),
    controller("/api/v1", ApiController),
    controller("/", PagesController),
  ];
}
