// App
import { UserService, Response } from '../app/services';


export async function main(args: any) {
  const userService = new UserService();
  const response: Response = await userService.insertUser(args.firstName, args.email, args.username, args.password, args.secondName);
  console.log(response.buildResponse())
}
