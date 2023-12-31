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
import { request } from "@/utils/request/index";
import type {
  IPasswordReset,
  IResponseIUser,
  IResponseSequelizePaginationIUser,
  IResponseVoid,
  OmitIUserUserId,
  OmitIUserUserIdOrUsernameOrPassword,
} from "./data-contracts";

/**
 * No description
 *
 * @tags User
 * @name adminUserList
 * @summary Get all users
 * @request GET:/user/list
 */
export const adminUserList = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIUser>({
    path: `/user/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserListSkipErrorHandler = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIUser>({
    path: `/user/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserCurr
 * @summary Get current user
 * @request GET:/user
 */
export const adminUserCurr = (params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserCurrSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: "GET",
    format: "json",
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
export const adminUserCreate = (data: OmitIUserUserId, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserCreateSkipErrorHandler = (data: OmitIUserUserId, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
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
 * @tags User
 * @name adminUserQuery
 * @summary Get user by id
 * @request GET:/user/{id}
 */
export const adminUserQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserEdit
 * @summary Update user
 * @request PUT:/user/{id}
 */
export const adminUserEdit = (id: number, data: OmitIUserUserIdOrUsernameOrPassword, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserEditSkipErrorHandler = (
  id: number,
  data: OmitIUserUserIdOrUsernameOrPassword,
  params: RequestParams = {},
) =>
  request<IResponseIUser>({
    path: `/user/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserDelete
 * @summary Delete user
 * @request DELETE:/user/{id}
 */
export const adminUserDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags User
 * @name adminUserResetPassword
 * @summary Reset password
 * @request PUT:/user/{id}/password
 */
export const adminUserResetPassword = (id: number, data: IPasswordReset, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}/password`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserResetPasswordSkipErrorHandler = (id: number, data: IPasswordReset, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}/password`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
