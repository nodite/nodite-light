import { IUser } from '@components/user/user.interface';
import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  userId?: IUser['id'];
}
