import { IUser } from '@components/user/_iac/user.interface';

/**
 * Type LoginBody.
 */
export type LoginBody = Pick<IUser, 'username' | 'password'> & {
  email?: string;
};

/**
 * Interface LoginResponse.
 */
export interface LoginResponse {
  token: string;
  expiresIn: number;
}

/**
 * Type RegisterBody.
 */
export type RegisterBody = Pick<IUser, 'username' | 'email' | 'password'>;
