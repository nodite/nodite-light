import { IUser } from '@/components/user/user.model';

export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserUpdate = Omit<IUser, 'userId' | 'username' | 'password'>;

export interface IPasswordReset {
  /**
   * password
   */
  password: string;

  /**
   * Confirm password
   */
  confirmPassword: string;
}
