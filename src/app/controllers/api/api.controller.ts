import { controller } from "@foal/core";
import { RecipeApiController } from "./recipe.controller";
import { SearchApiController } from "./search.controller";
import { AuthenticationController } from "./authentication.controller";
import { PlanController } from "./plan.controller";
import { PreferenceController } from './preference.controller';
import { FavoritesController } from "./favorites.controller";

export class ApiController {
  subControllers = [
    controller("/recipe", RecipeApiController),
    controller("/search", SearchApiController),
    controller("/plan", PlanController),
    controller("/preference", PreferenceController),
    controller("/favorites", FavoritesController),
    controller("/", AuthenticationController),
  ];
}
