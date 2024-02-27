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
  IDictGroupCreate,
  IDictGroupUpdate,
  IDictItemCreate,
  IDictItemUpdate,
  IDictTypeCreate,
  IDictTypeUpdate,
  IResponseDataTreeIDictGroupArray,
  IResponseIDictGroup,
  IResponseIDictGroupArray,
  IResponseIDictItem,
  IResponseIDictType,
  IResponseIDictTypeWithItems,
  IResponseSequelizePaginationIDictItem,
  IResponseSequelizePaginationIDictTypeWithItems,
  IResponseVoid,
} from "./data-contracts";

/**
 * No description
 *
 * @tags dict
 * @name adminDictTypeList
 * @summary Get all dict types
 * @request GET:/dict/type/list
 */
export const adminDictTypeList = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIDictTypeWithItems>({
    path: `/dict/type/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictTypeListSkipErrorHandler = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIDictTypeWithItems>({
    path: `/dict/type/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictTypeQuery
 * @summary Get dict type by id
 * @request GET:/dict/type/{id}
 */
export const adminDictTypeQuery = (id: string, params: RequestParams = {}) =>
  request<IResponseIDictTypeWithItems>({
    path: `/dict/type/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictTypeQuerySkipErrorHandler = (id: string, params: RequestParams = {}) =>
  request<IResponseIDictTypeWithItems>({
    path: `/dict/type/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictTypeEdit
 * @summary Update dict type
 * @request PUT:/dict/type/{id}
 */
export const adminDictTypeEdit = (id: string, data: IDictTypeUpdate, params: RequestParams = {}) =>
  request<IResponseIDictType>({
    path: `/dict/type/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictTypeEditSkipErrorHandler = (id: string, data: IDictTypeUpdate, params: RequestParams = {}) =>
  request<IResponseIDictType>({
    path: `/dict/type/${id}`,
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
 * @tags dict
 * @name adminDictTypeDelete
 * @summary Delete dict type
 * @request DELETE:/dict/type/{id}
 */
export const adminDictTypeDelete = (id: string, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/type/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictTypeDeleteSkipErrorHandler = (id: string, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/type/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictTypeCreate
 * @summary Create dict type
 * @request POST:/dict/type
 */
export const adminDictTypeCreate = (data: IDictTypeCreate, params: RequestParams = {}) =>
  request<IResponseIDictType>({
    path: `/dict/type`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictTypeCreateSkipErrorHandler = (data: IDictTypeCreate, params: RequestParams = {}) =>
  request<IResponseIDictType>({
    path: `/dict/type`,
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
 * @tags dict
 * @name adminDictItemList
 * @summary Get all dict items
 * @request GET:/dict/item/list
 */
export const adminDictItemList = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIDictItem>({
    path: `/dict/item/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictItemListSkipErrorHandler = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationIDictItem>({
    path: `/dict/item/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictItemQuery
 * @summary Get dict item by id
 * @request GET:/dict/item/{id}
 */
export const adminDictItemQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictItemQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictItemEdit
 * @summary Update dict item
 * @request PUT:/dict/item/{id}
 */
export const adminDictItemEdit = (id: number, data: IDictItemUpdate, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictItemEditSkipErrorHandler = (id: number, data: IDictItemUpdate, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item/${id}`,
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
 * @tags dict
 * @name adminDictItemDelete
 * @summary Delete dict item
 * @request DELETE:/dict/item/{id}
 */
export const adminDictItemDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/item/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictItemDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/item/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictItemCreate
 * @summary Create dict item
 * @request POST:/dict/item
 */
export const adminDictItemCreate = (data: IDictItemCreate, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictItemCreateSkipErrorHandler = (data: IDictItemCreate, params: RequestParams = {}) =>
  request<IResponseIDictItem>({
    path: `/dict/item`,
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
 * @tags dict
 * @name adminDictGroupList
 * @summary List dict groups.
 * @request GET:/dict/group/list
 */
export const adminDictGroupList = (params: RequestParams = {}) =>
  request<IResponseIDictGroupArray>({
    path: `/dict/group/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupListSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIDictGroupArray>({
    path: `/dict/group/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictGroupTree
 * @summary List dict group tree.
 * @request GET:/dict/group/tree
 */
export const adminDictGroupTree = (params: RequestParams = {}) =>
  request<IResponseDataTreeIDictGroupArray>({
    path: `/dict/group/tree`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupTreeSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseDataTreeIDictGroupArray>({
    path: `/dict/group/tree`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictGroupQuery
 * @summary Get dict group by id.
 * @request GET:/dict/group/{id}
 */
export const adminDictGroupQuery = (id: string, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupQuerySkipErrorHandler = (id: string, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictGroupEdit
 * @summary Update dict group.
 * @request PUT:/dict/group/{id}
 */
export const adminDictGroupEdit = (id: string, data: IDictGroupUpdate, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupEditSkipErrorHandler = (id: string, data: IDictGroupUpdate, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group/${id}`,
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
 * @tags dict
 * @name adminDictGroupDelete
 * @summary Delete dict group.
 * @request DELETE:/dict/group/{id}
 */
export const adminDictGroupDelete = (id: string, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/group/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupDeleteSkipErrorHandler = (id: string, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/dict/group/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags dict
 * @name adminDictGroupCreate
 * @summary Create dict group.
 * @request POST:/dict/group
 */
export const adminDictGroupCreate = (data: IDictGroupCreate, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminDictGroupCreateSkipErrorHandler = (data: IDictGroupCreate, params: RequestParams = {}) =>
  request<IResponseIDictGroup>({
    path: `/dict/group`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
