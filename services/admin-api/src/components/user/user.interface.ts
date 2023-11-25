export interface IUser {
  /**
   * @format uuid
   */
  id: string;

  /**
   * @example Oscaner Miao
   */
  name: string;

  /**
   * @example oscaner1997\@gmail.com
   */
  email: string;

  /**
   * @example active
   */
  status?: 'active' | 'inactive';

  /**
   * @example 12345678910
   */
  phone?: string;
}
