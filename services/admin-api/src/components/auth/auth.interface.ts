import { IUser } from '@/components/user/user.model';

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
