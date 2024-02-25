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
  IResponseDataTreeIDictGroupArray,
  IResponseIDictGroup,
  IResponseIDictGroupArray,
  IResponseVoid,
} from "./data-contracts";

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
