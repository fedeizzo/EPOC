import { controller } from "@foal/core";

import { ApiController, RecipeController } from "./controllers";
import { SearchController } from "./controllers/search.controller";

export class AppController {
  subControllers = [
    controller("/api", ApiController),
    controller("/search", SearchController),
    controller("/recipe", RecipeController),
  ];
}
