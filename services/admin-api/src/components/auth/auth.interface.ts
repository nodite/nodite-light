import { IUser } from '@components/user/user.interface';

export type LoginBody = Pick<IUser, 'username' | 'password'> & {
  email?: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: number;
};

export type RegisterBody = Pick<IUser, 'username' | 'email' | 'password'>;
