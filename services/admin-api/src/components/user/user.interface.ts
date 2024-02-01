import { IUser } from '@/components/user/user.model';

export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserUpdate = Omit<IUser, 'userId' | 'username' | 'password'>;

export interface IPasswordReset {
  password: string;
  confirmPassword: string;
}

export interface IProfile extends IUser {
  roles: string[];
  perms: string[];
}
