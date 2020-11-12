// App
import { UserService, ServiceResponse } from '../app/services';


export async function main(args: any) {
  const userService = new UserService();
  const response: ServiceResponse = await userService.insertUser(args.firstName, args.email, args.username, args.password, args.secondName);
  console.log(response.buildResponse())
}
