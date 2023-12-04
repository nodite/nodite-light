import { IUser } from '@components/user/user.interface';
import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  user?: Pick<IUser, 'userId' | 'username' | 'email'>;
}
