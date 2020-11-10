// App
import { User, Response } from '../app/services';


export async function main(args: any) {
  const user = new User();
  const response: Response = await user.insertUser(args.firstName, args.email, args.username, args.password, args.secondName);
  console.log(response.buildResponse())
}
