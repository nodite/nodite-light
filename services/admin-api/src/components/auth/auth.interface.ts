import { IUser } from '@components/user/user.interface';

export type LoginBody = Pick<IUser, 'username' | 'email' | 'password'>;
