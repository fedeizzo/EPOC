// App
import { UserService, ServiceResponse } from '../app/services';


export async function main(args: any) {
  const userService = new UserService();
  const response: ServiceResponse = await userService.deleteUser(args.username, args.password);
  
  console.log(response.buildResponse())
}
