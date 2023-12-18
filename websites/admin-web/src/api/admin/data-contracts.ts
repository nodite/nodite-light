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
  deleted?: 0 | 1 | 100;
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
  /**
   * Parent menu ID
   * @format double
   */
  parentId: number;
  /** Menu name */
  name: string;
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
  /** Menu icon */
  icon: string;
  /** Menu hidden */
  hidden: boolean;
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

/** Interface IUser. */
export interface IUser {
  /** Status */
  status?: 0 | 1;
  /** Deleted */
  deleted?: 0 | 1 | 100;
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

export interface IResponseIUserArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IUser[];
}

export interface IResponseIUser {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** Interface IUser. */
  data?: IUser;
}

export interface IResponseNumber {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** @format double */
  data?: number;
}
