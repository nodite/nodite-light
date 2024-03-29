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
  IPasswordReset,
  IResponseIProfile,
  IResponseIRoleWithUsersArray,
  IResponseIUser,
  IResponseSequelizePaginationIUser,
  IResponseVoid,
  IUserCreate,
  IUserUpdate,
} from "./data-contracts";

/**
 * No description
 *
 * @tags user
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
 * @tags user
 * @name adminUserProfile
 * @summary Get current user
 * @request GET:/user/profile
 */
export const adminUserProfile = (params: RequestParams = {}) =>
  request<IResponseIProfile>({
    path: `/user/profile`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserProfileSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIProfile>({
    path: `/user/profile`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags user
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
 * @tags user
 * @name adminUserEdit
 * @summary Update user
 * @request PUT:/user/{id}
 */
export const adminUserEdit = (id: number, data: IUserUpdate, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserEditSkipErrorHandler = (id: number, data: IUserUpdate, params: RequestParams = {}) =>
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
 * @tags user
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
 * @tags user
 * @name adminUserCreate
 * @summary Create user
 * @request POST:/user
 */
export const adminUserCreate = (data: IUserCreate, params: RequestParams = {}) =>
  request<IResponseIUser>({
    path: `/user`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserCreateSkipErrorHandler = (data: IUserCreate, params: RequestParams = {}) =>
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
 * @tags user
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

/**
 * No description
 *
 * @tags user
 * @name adminUserRoleList
 * @request GET:/user/{id}/roles
 */
export const adminUserRoleList = (id: number, params: RequestParams = {}) =>
  request<IResponseIRoleWithUsersArray>({
    path: `/user/${id}/roles`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserRoleListSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIRoleWithUsersArray>({
    path: `/user/${id}/roles`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags user
 * @name adminUserRoleAssign
 * @request PUT:/user/{id}/roles
 */
export const adminUserRoleAssign = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}/roles`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserRoleAssignSkipErrorHandler = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}/roles`,
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
 * @tags user
 * @name adminUserRoleUnassign
 * @request DELETE:/user/{id}/roles
 */
export const adminUserRoleUnassign = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}/roles`,
    method: "DELETE",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminUserRoleUnassignSkipErrorHandler = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/user/${id}/roles`,
    method: "DELETE",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
