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

import type { RequestParams } from "@/types/request";
import { ContentType } from "@/types/request";
import { request } from "@/utils/requests";
import type {
  IResponseJwtDestroyType,
  IResponseLoginResponse,
  IResponseTrue,
  LoginBody,
  RegisterBody,
} from "./data-contracts";

/**
 * No description
 *
 * @tags auth
 * @name adminAuthRegister
 * @summary Register
 * @request POST:/auth/register
 */
export const adminAuthRegister = (data: RegisterBody, params: RequestParams = {}) =>
  request<IResponseTrue>({
    path: `/auth/register`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminAuthRegisterSkipErrorHandler = (data: RegisterBody, params: RequestParams = {}) =>
  request<IResponseTrue>({
    path: `/auth/register`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags auth
 * @name adminAuthLogin
 * @summary Login
 * @request POST:/auth/login
 */
export const adminAuthLogin = (data: LoginBody, params: RequestParams = {}) =>
  request<IResponseLoginResponse>({
    path: `/auth/login`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminAuthLoginSkipErrorHandler = (data: LoginBody, params: RequestParams = {}) =>
  request<IResponseLoginResponse>({
    path: `/auth/login`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags auth
 * @name adminAuthLogout
 * @summary Logout
 * @request DELETE:/auth/logout
 */
export const adminAuthLogout = (params: RequestParams = {}) =>
  request<IResponseJwtDestroyType>({
    path: `/auth/logout`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminAuthLogoutSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseJwtDestroyType>({
    path: `/auth/logout`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
