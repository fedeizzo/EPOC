export interface ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: any;

  buildResponse: () => (object);
}

export enum ServiceResponseCode {
  ok,
  passwordTooCommon,
  wrongCredentials,
  elementNotFound,
  duplicateKeyInDb,
  internalServerErrorQueryingRecipes, // 500
  recipeIdNotFound, // 404
}
