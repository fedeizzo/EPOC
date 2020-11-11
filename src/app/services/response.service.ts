export interface ServiceResponse {
  code: number;
  text: string;
  prop?: any;

  buildResponse: () => (object);
}
