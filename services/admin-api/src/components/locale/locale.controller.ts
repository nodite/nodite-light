import { Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { Cacheable, CacheClear } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import { Body, Delete, Get, Middlewares, OperationId, Path, Post, Put, Route, Tags } from 'tsoa';

import BaseController from '@/components/base.controller';
import {
  IAvailableLocale,
  ILocaleCreate,
  ILocaleUpdate,
} from '@/components/locale/locale.interface';
import { ILocale } from '@/components/locale/locale.model';
import LocaleService from '@/components/locale/locale.service';
import {
  LocaleCreateValidation,
  LocaleEditValidation,
} from '@/components/locale/locale.validation';

@Route('locale')
@Tags('locale')
export class LocaleLangController extends BaseController {
  localeService: LocaleService;

  constructor() {
    super();
    this.localeService = new LocaleService();
  }

  /**
   * @summary Get locale list
   */
  @Get('/list')
  @OperationId('admin:locale:list')
  @Permissions('admin:locale:list')
  public async list(): Promise<IResponse<ILocale[]>> {
    const list = await this.localeService.selectLocaleList();
    this.setStatus(httpStatus.OK);
    return this.response(list);
  }

  /**
   * @summary Get available locales
   */
  @Get('/available')
  @OperationId('admin:locale:available')
  @Cacheable({ hashKey: 'locale:available' })
  public async listAvailable(): Promise<IResponse<IAvailableLocale[]>> {
    const list = await this.localeService.selectAvailableLocaleList();
    this.setStatus(httpStatus.OK);
    return this.response(list);
  }

  /**
   * @summary Get locale by id
   */
  @Get('{id}')
  @OperationId('admin:locale:query')
  @Permissions('admin:locale:query')
  @Cacheable({ hashKey: 'locale:query', cacheKey: (args) => args[0] })
  public async query(@Path() id: number): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.selectLocaleById(id);
    this.setStatus(httpStatus.OK);
    return this.response(locale);
  }

  /**
   * @summary Create locale
   */
  @Post()
  @Middlewares([validate(LocaleCreateValidation)])
  @OperationId('admin:locale:create')
  @CacheClear({ hashKey: 'locale:available' })
  public async create(@Body() body: ILocaleCreate): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(locale);
  }

  /**
   * @summary Update locale
   */
  @Put('{id}')
  @Middlewares([validate(LocaleEditValidation)])
  @OperationId('admin:locale:edit')
  @Permissions('admin:locale:edit')
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({ hashKey: 'locale:query', cacheKey: (args) => args[0] })
  public async update(
    @Path() id: number,
    @Body() body: ILocaleUpdate,
  ): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.update(id, body);
    this.setStatus(httpStatus.OK);
    return this.response(locale);
  }

  /**
   * @summary Delete locale
   */
  @Delete('{id}')
  @OperationId('admin:locale:delete')
  @Permissions('admin:locale:delete')
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({ hashKey: 'locale:query', cacheKey: (args) => args[0] })
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.localeService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default LocaleLangController;
