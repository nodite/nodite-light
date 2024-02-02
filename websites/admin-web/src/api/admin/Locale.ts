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
  ILocaleCreate,
  ILocaleUpdate,
  IMessageUpsert,
  IResponseIAvailableLocaleArray,
  IResponseIAvailableMessageArray,
  IResponseILocale,
  IResponseILocaleArray,
  IResponseILocaleSource,
  IResponseSequelizePaginationISourceWithMessages,
  IResponseVoid,
  ISourceCreate,
} from "./data-contracts";

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleList
 * @summary Get locale list
 * @request GET:/locale/i/list
 */
export const adminLocaleList = (params: RequestParams = {}) =>
  request<IResponseILocaleArray>({
    path: `/locale/i/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleListSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseILocaleArray>({
    path: `/locale/i/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleAvailable
 * @summary Get available locales
 * @request GET:/locale/i/available
 */
export const adminLocaleAvailable = (params: RequestParams = {}) =>
  request<IResponseIAvailableLocaleArray>({
    path: `/locale/i/available`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleAvailableSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIAvailableLocaleArray>({
    path: `/locale/i/available`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleQuery
 * @summary Get locale by id
 * @request GET:/locale/i/{id}
 */
export const adminLocaleQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleEdit
 * @summary Update locale
 * @request PUT:/locale/i/{id}
 */
export const adminLocaleEdit = (id: number, data: ILocaleUpdate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleEditSkipErrorHandler = (id: number, data: ILocaleUpdate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i/${id}`,
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
 * @tags locale
 * @name adminLocaleDelete
 * @summary Delete locale
 * @request DELETE:/locale/i/{id}
 */
export const adminLocaleDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/i/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/i/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleCreate
 * @summary Create locale
 * @request POST:/locale/i
 */
export const adminLocaleCreate = (data: ILocaleCreate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleCreateSkipErrorHandler = (data: ILocaleCreate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/i`,
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
 * @tags locale
 * @name adminLocaleSourceList
 * @summary Get source list.
 * @request GET:/locale/source/list
 */
export const adminLocaleSourceList = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationISourceWithMessages>({
    path: `/locale/source/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleSourceListSkipErrorHandler = (
  query?: {
    /** @format double */
    page?: number;
    /** @format double */
    itemsPerPage?: number;
  },
  params: RequestParams = {},
) =>
  request<IResponseSequelizePaginationISourceWithMessages>({
    path: `/locale/source/list`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleSourceCreate
 * @summary Create locale source if missing
 * @request POST:/locale/source
 */
export const adminLocaleSourceCreate = (data: ISourceCreate, params: RequestParams = {}) =>
  request<IResponseILocaleSource>({
    path: `/locale/source`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleSourceCreateSkipErrorHandler = (data: ISourceCreate, params: RequestParams = {}) =>
  request<IResponseILocaleSource>({
    path: `/locale/source`,
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
 * @tags locale
 * @name adminLocaleMessageAvailable
 * @summary Get available message list
 * @request GET:/locale/message/available
 */
export const adminLocaleMessageAvailable = (
  query?: {
    langcode?: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseIAvailableMessageArray>({
    path: `/locale/message/available`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleMessageAvailableSkipErrorHandler = (
  query?: {
    langcode?: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseIAvailableMessageArray>({
    path: `/locale/message/available`,
    method: "GET",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleMessageUpsert
 * @summary Upsert messages
 * @request POST:/locale/message/upsert
 */
export const adminLocaleMessageUpsert = (data: IMessageUpsert[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/message/upsert`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleMessageUpsertSkipErrorHandler = (data: IMessageUpsert[], params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/message/upsert`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
