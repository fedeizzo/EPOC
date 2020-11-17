import { controller } from "@foal/core";
import { RecipeApiController } from "./recipe.controller";
import { SearchApiController } from "./search.controller";

export class ApiController {
  subControllers = [
    controller("/recipe", RecipeApiController),
    controller("/search", SearchApiController),
  ];
}
