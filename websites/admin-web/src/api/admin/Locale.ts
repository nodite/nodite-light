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
  ILocaleCreate,
  ILocaleUpdate,
  IResponseIAvailableLocaleArray,
  IResponseILocale,
  IResponseILocaleArray,
  IResponseVoid,
} from "./data-contracts";

/**
 * No description
 *
 * @tags locale
 * @name adminLocaleList
 * @summary Get locale list
 * @request GET:/locale/list
 */
export const adminLocaleList = (params: RequestParams = {}) =>
  request<IResponseILocaleArray>({
    path: `/locale/list`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleListSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseILocaleArray>({
    path: `/locale/list`,
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
 * @request GET:/locale/available
 */
export const adminLocaleAvailable = (params: RequestParams = {}) =>
  request<IResponseIAvailableLocaleArray>({
    path: `/locale/available`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleAvailableSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseIAvailableLocaleArray>({
    path: `/locale/available`,
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
 * @request GET:/locale/{id}
 */
export const adminLocaleQuery = (id: number, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/${id}`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleQuerySkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/${id}`,
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
 * @request PUT:/locale/{id}
 */
export const adminLocaleEdit = (id: number, data: ILocaleUpdate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/${id}`,
    method: "PUT",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleEditSkipErrorHandler = (id: number, data: ILocaleUpdate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale/${id}`,
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
 * @request DELETE:/locale/{id}
 */
export const adminLocaleDelete = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/${id}`,
    method: "DELETE",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleDeleteSkipErrorHandler = (id: number, params: RequestParams = {}) =>
  request<IResponseVoid>({
    path: `/locale/${id}`,
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
 * @request POST:/locale
 */
export const adminLocaleCreate = (data: ILocaleCreate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminLocaleCreateSkipErrorHandler = (data: ILocaleCreate, params: RequestParams = {}) =>
  request<IResponseILocale>({
    path: `/locale`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
