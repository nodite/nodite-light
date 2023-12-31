/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface IResponseTrue {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: true;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserUsernameOrEmailOrPassword {
  /** Username */
  username: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** Type RegisterBody. */
export type RegisterBody = PickIUserUsernameOrEmailOrPassword;

/** Interface LoginResponse. */
export interface LoginResponse {
  token: string;
  /** @format double */
  expiresIn: number;
}

export interface IResponseLoginResponse {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** Interface LoginResponse. */
  data?: LoginResponse;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserUsernameOrPassword {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

/** Type LoginBody. */
export type LoginBody = PickIUserUsernameOrPassword & {
  email?: string;
};

/** Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`. */
export type AwaitedReturnTypeAwaitedReturnTypeTypeofjwtAsync5Bdestroy5D = any;

export type JwtDestroyType = AwaitedReturnTypeAwaitedReturnTypeTypeofjwtAsync5Bdestroy5D;

export interface IResponseJwtDestroyType {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: JwtDestroyType;
}

/** Interface IMenu. */
export interface IMenu {
  /** Status */
  status?: 0 | 1;
  /** Deleted */
  deleted?: 0 | 1 | 9;
  /** Create by */
  createBy?: string;
  /**
   * Create time
   * @format date-time
   */
  createTime?: string;
  /** Update by */
  updateBy?: string;
  /**
   * Update time
   * @format date-time
   */
  updateTime?: string;
  /**
   * Menu ID
   * @format double
   */
  menuId: number;
  /** Menu name */
  menuName: string;
  /**
   * Parent menu ID
   * @format double
   */
  parentId: number;
  /**
   * Order number
   * @format double
   */
  orderNum: number;
  /** Menu icon */
  icon: string;
  /** Menu name i18n key */
  iKey: string;
  /** Menu type */
  iType: string;
  /** Menu path */
  path: string;
  /** Menu redirect */
  redirect: string;
  /** Menu component */
  component: string;
  /** Menu hidden */
  hidden: 0 | 1;
  /** Menu layout */
  layout: string;
  /** Menu perms */
  perms: string;
}

export interface IResponseIMenuArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IMenu[];
}

/** Type MenuTree. */
export type MenuTree = IMenu & {
  children?: MenuTree[];
  /** @format double */
  level?: number;
};

export interface IResponseMenuTreeArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: MenuTree[];
}

export interface IResponseIMenu {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** Interface IMenu. */
  data?: IMenu;
}

export interface IResponseVoid {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: any;
}

/** Interface IUser. */
export interface IUser {
  /** Status */
  status?: 0 | 1;
  /** Deleted */
  deleted?: 0 | 1 | 9;
  /** Create by */
  createBy?: string;
  /**
   * Create time
   * @format date-time
   */
  createTime?: string;
  /** Update by */
  updateBy?: string;
  /**
   * Update time
   * @format date-time
   */
  updateTime?: string;
  /**
   * User ID
   * @format double
   */
  userId: number;
  /** Username */
  username: string;
  /** Nickname */
  nickname: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Phone */
  phone: string;
  /** Sex */
  sex: 0 | 1;
  /** Avatar */
  avatar: string;
  /** Password */
  password: string;
}

export interface PaginationIUser {
  items: IUser[];
  /** @format double */
  count: number;
  /** @format double */
  totalCount: number;
  /** @format double */
  totalPage: number;
  /** @format double */
  page: number;
  /** @format double */
  itemsPerPage: number;
}

export interface IResponsePaginationIUser {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: PaginationIUser;
}

export interface QueryParams {
  /** @format double */
  page?: number;
  /** @format double */
  itemsPerPage?: number;
  [key: string]: any;
}

export interface IResponseIUser {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** Interface IUser. */
  data?: IUser;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserExcludeKeysUsernameOrPassword {
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * User ID
   * @format double
   */
  userId: number;
  /** Nickname */
  nickname: string;
  /** Phone */
  phone: string;
  /** Sex */
  sex: 0 | 1;
  /** Avatar */
  avatar: string;
  /** Status */
  status?: 0 | 1;
  /** Deleted */
  deleted?: 0 | 1 | 9;
  /** Create by */
  createBy?: string;
  /**
   * Create time
   * @format date-time
   */
  createTime?: string;
  /** Update by */
  updateBy?: string;
  /**
   * Update time
   * @format date-time
   */
  updateTime?: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIUserUsernameOrPassword = PickIUserExcludeKeysUsernameOrPassword;

export interface IPasswordReset {
  /** password */
  password: string;
  /** Confirm password */
  confirmPassword: string;
}
