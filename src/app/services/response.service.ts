export interface Response {
  code: number;
  text: string;
  prop?: any;

  buildResponse: () => (object);
}
