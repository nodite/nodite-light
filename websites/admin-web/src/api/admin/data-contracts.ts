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

export interface LoginResponse {
  /** @format double */
  expiresIn: number;
  token: string;
}

export interface IResponseLoginResponse {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: LoginResponse;
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

export type LoginBody = PickIUserUsernameOrEmailOrPassword;

/** Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`. */
export type AwaitedReturnTypeTypeofjwtAsyncDestroy = any;

export type JwtDestroyType = AwaitedReturnTypeTypeofjwtAsyncDestroy;

export interface IResponseJwtDestroyType {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: JwtDestroyType;
}

export interface IUser {
  /** Status */
  status?: 0 | 1;
  /** Deleted */
  deleted?: 0 | 1 | 100;
  /** Create by */
  create_by?: string;
  /**
   * Create time
   * @format date-time
   */
  create_time?: string;
  /** Update by */
  update_by?: string;
  /**
   * Update time
   * @format date-time
   */
  update_time?: string;
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
