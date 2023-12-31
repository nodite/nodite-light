import { IBase } from '@/components/base.interface';

export interface IRole extends IBase {
  /**
   * Role ID
   */
  roleId: number;

  /**
   * Role name
   */
  roleName: string;

  /**
   * Role key
   */
  roleKey: string;

  /**
   * Order number
   */
  orderNum: number;

  /**
   * i18n key
   */
  iKey: string;
}
