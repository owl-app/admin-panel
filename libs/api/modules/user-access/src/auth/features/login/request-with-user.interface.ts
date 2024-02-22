import { Request } from 'express';
import { IUser } from '@owl-app/lib-contracts';
 
interface RequestWithUser extends Request {
  user: IUser;
}
 
export default RequestWithUser;