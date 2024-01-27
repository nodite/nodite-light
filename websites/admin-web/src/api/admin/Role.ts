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
  IResponseIRole,
  IResponseIUserWithRolesArray,
  IResponsePickIMenuMenuIdOrPermsArray,
  IResponseSequelizePaginationIRole,
  IResponseVoid,
  IRoleCreate,
  IRoleUpdate,
} from "./data-contracts";

/**
 * No description
 *
 * @tags role
 * @name adminRoleList
 * @summary Get all roles
 * @request GET:/role/list
 */
export const adminRoleList = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIRole>({
    path: `/role/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleListSkipErrorHandler = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIRole>({
    path: `/role/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags role
 * @name adminRoleQuery
 * @summary Get role by id
 * @request GET:/role/{id}
 */
export const adminRoleQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags role
 * @name adminRoleEdit
 * @summary Update user
 * @request PUT:/role/{id}
 */
export const adminRoleEdit = (id: number, data: IRoleUpdate, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleEditSkipErrorHandler = (id: number, data: IRoleUpdate, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role/${id}`,
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
 * @tags role
 * @name adminRoleDelete
 * @summary Delete role
 * @request DELETE:/role/{id}
 */
export const adminRoleDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags role
 * @name adminRoleCreate
 * @summary Create role
 * @request POST:/role
 */
export const adminRoleCreate = (data: IRoleCreate, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleCreateSkipErrorHandler = (data: IRoleCreate, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role`,
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
 * @tags role
 * @name adminRolePermList
 * @request GET:/role/{id}/perms
 */
export const adminRolePermList = (id: number, params: RequestParams = {}) =>
  request<IResponsePickIMenuMenuIdOrPermsArray>({
    path: `/role/${id}/perms`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRolePermListSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponsePickIMenuMenuIdOrPermsArray>({
    path: `/role/${id}/perms`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags role
 * @name adminRolePermUpdate
 * @request PUT:/role/{id}/perms
 */
export const adminRolePermUpdate = (id: number, data: string[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/perms`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRolePermUpdateSkipErrorHandler = (id: number, data: string[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/perms`,
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
 * @tags role
 * @name adminRoleUserList
 * @request GET:/role/{id}/users
 */
export const adminRoleUserList = (id: number, params: RequestParams = {}) =>
  request<IResponseIUserWithRolesArray>({
    path: `/role/${id}/users`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleUserListSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIUserWithRolesArray>({
    path: `/role/${id}/users`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags role
 * @name adminRoleUserAssign
 * @request PUT:/role/{id}/users
 */
export const adminRoleUserAssign = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/users`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleUserAssignSkipErrorHandler = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/users`,
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
 * @tags role
 * @name adminRoleUserUnassign
 * @request DELETE:/role/{id}/users
 */
export const adminRoleUserUnassign = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/users`,
    method: "DELETE",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleUserUnassignSkipErrorHandler = (id: number, data: number[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/role/${id}/users`,
    method: "DELETE",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
