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

import type { RequestParams } from '@/types/request';
import { ContentType } from '@/types/request';
import { request } from '@/utils/request/index';
import type { IResponseIUser, IResponseIUserArray, IResponseNumber, IUser } from './data-contracts';

/**
 * No description
 *
 * @tags User
 * @name list
 * @summary Get all users
 * @request GET:/user/list
 */
export const list = (
  query: {
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
    /** Email */
    email: string;
    /** Phone */
    phone: string;
    /** Sex */
    sex: 0 | 1;
    /** Avatar */
    avatar: string;
    /** Password */
    password: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseIUserArray>({
    path: `/user/list`,
    method: 'GET',
    query: query,
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const listSkipErrorHandler = (
  query: {
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
    /** Email */
    email: string;
    /** Phone */
    phone: string;
    /** Sex */
    sex: 0 | 1;
    /** Avatar */
    avatar: string;
    /** Password */
    password: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseIUserArray>({
    path: `/user/list`,
    method: 'GET',
    query: query,
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name curr
 * @summary Get current user
 * @request GET:/user
 */
export const curr = (params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: 'GET',
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const currSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: 'GET',
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserCreate
 * @summary Create user
 * @request POST:/user
 */
export const adminUserCreate = (data: IUser, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: 'POST',
    body: data,
    type: ContentType.Json,
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const adminUserCreateSkipErrorHandler = (data: IUser, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: 'POST',
    body: data,
    type: ContentType.Json,
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserGet
 * @summary Get user by id
 * @request GET:/user/{userId}
 */
export const adminUserGet = (userId: number, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${userId}`,
    method: 'GET',
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const adminUserGetSkipErrorHandler = (userId: number, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${userId}`,
    method: 'GET',
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserUpdate
 * @summary Update user
 * @request PUT:/user/{userId}
 */
export const adminUserUpdate = (userId: number, data: IUser, params: RequestParams = {}) =>
  request<IResponseNumber>({
    path: `/user/${userId}`,
    method: 'PUT',
    body: data,
    type: ContentType.Json,
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const adminUserUpdateSkipErrorHandler = (userId: number, data: IUser, params: RequestParams = {}) =>
  request<IResponseNumber>({
    path: `/user/${userId}`,
    method: 'PUT',
    body: data,
    type: ContentType.Json,
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserDelete
 * @summary Delete user
 * @request DELETE:/user/{userId}
 */
export const adminUserDelete = (userId: number, params: RequestParams = {}) =>
  request<IResponseNumber>({
    path: `/user/${userId}`,
    method: 'DELETE',
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const adminUserDeleteSkipErrorHandler = (userId: number, params: RequestParams = {}) =>
  request<IResponseNumber>({
    path: `/user/${userId}`,
    method: 'DELETE',
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });
