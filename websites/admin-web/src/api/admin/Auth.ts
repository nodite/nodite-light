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
import type { IResponseJwtDestroyType, IResponseString, LoginBody } from './data-contracts';

/**
 * No description
 *
 * @tags auth
 * @name login
 * @summary Login
 * @request POST:/auth/login
 */
export const login = (data: LoginBody, params: RequestParams = {}) =>
  request<IResponseString>({
    path: `/auth/login`,
    method: 'POST',
    body: data,
    type: ContentType.Json,
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const loginSkipErrorHandler = (data: LoginBody, params: RequestParams = {}) =>
  request<IResponseString>({
    path: `/auth/login`,
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
 * @tags auth
 * @name logout
 * @summary Logout
 * @request DELETE:/auth/logout
 */
export const logout = (params: RequestParams = {}) =>
  request<IResponseJwtDestroyType>({
    path: `/auth/logout`,
    method: 'DELETE',
    format: 'json',
    skipErrorHandler: false,
    ...params,
  });
export const logoutSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseJwtDestroyType>({
    path: `/auth/logout`,
    method: 'DELETE',
    format: 'json',
    skipErrorHandler: true,
    ...params,
  });
