import { IBase } from '@/components/base.interface';

/**
 * Interface IUser.
 */
export interface IUser extends IBase {
  /**
   * User ID
   */
  userId: number;

  /**
   * Username
   */
  username: string;

  /**
   * Nickname
   */
  nickname: string;

  /**
   * Email
   * @format email
   */
  email: string;

  /**
   * Phone
   */
  phone: string;

  /**
   * Sex
   */
  sex: 0 | 1;

  /**
   * Avatar
   */
  avatar: string;

  /**
   * Password
   */
  password: string;
}

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

export default {};
