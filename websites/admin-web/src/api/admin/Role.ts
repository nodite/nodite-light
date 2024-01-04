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
  IResponseSequelizePaginationIRole,
  IResponseVoid,
  OmitIRoleRoleId,
  OmitIRoleRoleIdOrRoleKey,
} from "./data-contracts";

/**
 * No description
 *
 * @tags Role
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
 * @tags Role
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
 * @tags Role
 * @name adminRoleEdit
 * @summary Update user
 * @request PUT:/role/{id}
 */
export const adminRoleEdit = (id: number, data: OmitIRoleRoleIdOrRoleKey, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleEditSkipErrorHandler = (id: number, data: OmitIRoleRoleIdOrRoleKey, params: RequestParams = {}) =>
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
 * @tags Role
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
 * @tags Role
 * @name adminRoleCreate
 * @summary Create role
 * @request POST:/role
 */
export const adminRoleCreate = (data: OmitIRoleRoleId, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminRoleCreateSkipErrorHandler = (data: OmitIRoleRoleId, params: RequestParams = {}) =>
  request<IResponseIRole>({
    path: `/role`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
