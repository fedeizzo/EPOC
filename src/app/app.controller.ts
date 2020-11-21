import { controller } from '@foal/core';
import { ApiController, PagesController } from "./controllers";

export class AppController {
  subControllers = [
    controller("/api/v1", ApiController),
    controller("/", PagesController),
  ];
}
