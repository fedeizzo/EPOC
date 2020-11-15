import { Context, Get, HttpResponseOK, HttpResponseBadRequest } from '@foal/core';
import { RecipeService, ServiceResponse } from '../services/index';


export class SearchController {

  @Get('/')
  async globalSearch(ctx: Context){
    return this.recipeSearch(ctx);
  }
  
  @Get('/recipe')
  async recipeSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    if(searched){
      let recipeService = await new RecipeService();
      let response : ServiceResponse = await recipeService.getPartialRecipeList(searched);
      if (response.code === 200) {
        return new HttpResponseOK(response.buildResponse());
      } else {
        return new HttpResponseBadRequest(response.buildResponse());
      }
    }
    return new HttpResponseBadRequest("You did'nt specify the query string");
  }
}
