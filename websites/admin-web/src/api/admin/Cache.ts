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
import type { IResponseVoid } from "./data-contracts";

/**
 * No description
 *
 * @tags cache
 * @name adminCacheInvalidate
 * @summary Clear cache
 * @request POST:/cache/invalidate
 */
export const adminCacheInvalidate = (
  query: {
    type: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseVoid>({
    path: `/cache/invalidate`,
    method: "POST",
    query: query,
    format: "json",
    skipErrorHandler: false,
    ...params,
  });
export const adminCacheInvalidateSkipErrorHandler = (
  query: {
    type: string;
  },
  params: RequestParams = {},
) =>
  request<IResponseVoid>({
    path: `/cache/invalidate`,
    method: "POST",
    query: query,
    format: "json",
    skipErrorHandler: true,
    ...params,
  });
