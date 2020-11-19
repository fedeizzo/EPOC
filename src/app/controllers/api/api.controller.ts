import { controller } from "@foal/core";
import { RecipeApiController } from "./recipe.controller";
import { SearchApiController } from "./search.controller";
import { AuthenticationController } from "./authentication.controller";
import { PreferenceController } from './preference.controller';
import { BlacklistController } from './blacklist.controller';

export class ApiController {
  subControllers = [
    controller("/recipe", RecipeApiController),
    controller("/search", SearchApiController),
    controller("/preference", PreferenceController),
    controller("/blacklist", BlacklistController),
    controller("/", AuthenticationController),
  ];
}
