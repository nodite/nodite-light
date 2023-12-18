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
import type { IMenu, IResponseIMenu, IResponseIMenuArray, IResponseMenuTreeArray } from "./data-contracts";

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
  request<IResponseMenuTreeArray>({
    path: `/menu/tree`,
    method: "GET",
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuTreeSkipErrorHandler = (params: RequestParams = {}) =>
  request<IResponseMenuTreeArray>({
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
 * @name adminMenuCreate
 * @summary Create menu
 * @request POST:/menu
 */
export const adminMenuCreate = (data: IMenu, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminMenuCreateSkipErrorHandler = (data: IMenu, params: RequestParams = {}) =>
  request<IResponseIMenu>({
    path: `/menu`,
    method: "POST",
    body: data,
    type: ContentType.Json,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
