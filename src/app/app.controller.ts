import { controller } from "@foal/core";
import { ApiController, SearchController, RecipeController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/search', SearchController),
    controller('/recipes', RecipeController)
  ];
}
