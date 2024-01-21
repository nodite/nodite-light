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
  IResponseDataTreeIMenuArray,
  IResponseIMenu,
  IResponseIMenuArray,
  IResponseVoid,
  OmitIMenuMenuId,
} from "./data-contracts";

/**
 * No description
 *
 * @tags menu
 * @name adminMenuList
 * @summary List menu by user
 * @request GET:/menu/list
 */
export const adminMenuList = (params: RequestParams = {}) =>
  request<IResponseIMenuArray>({
    path: `/menu/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuListSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIMenuArray>({
    path: `/menu/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags menu
 * @name adminMenuTree
 * @summary List menu tree by user
 * @request GET:/menu/tree
 */
export const adminMenuTree = (params: RequestParams = {}) =>
  request<IResponseDataTreeIMenuArray>({
    path: `/menu/tree`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuTreeSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseDataTreeIMenuArray>({
    path: `/menu/tree`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags menu
 * @name adminMenuQuery
 * @summary Get menu by id
 * @request GET:/menu/{id}
 */
export const adminMenuQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags menu
 * @name adminMenuEdit
 * @summary Update menu
 * @request PUT:/menu/{id}
 */
export const adminMenuEdit = (id: number, data: OmitIMenuMenuId, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuEditSkipErrorHandler = (id: number, data: OmitIMenuMenuId, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu/${id}`,
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
 * @tags menu
 * @name adminMenuDelete
 * @summary Delete menu
 * @request DELETE:/menu/{id}
 */
export const adminMenuDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/menu/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/menu/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags menu
 * @name adminMenuCreate
 * @summary Create menu
 * @request POST:/menu
 */
export const adminMenuCreate = (data: OmitIMenuMenuId, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuCreateSkipErrorHandler = (data: OmitIMenuMenuId, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
