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
import { request } from "@/utils/requests";
import type { IResponseDataTreeIDictGroupArray, IResponseIDictGroupArray } from "./data-contracts";

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
