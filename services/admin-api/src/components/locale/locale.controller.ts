import { Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { Cacheable, CacheClear, SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import {
  Body,
  Delete,
  Get,
  Header,
  Middlewares,
  OperationId,
  Path,
  Post,
  Put,
  Queries,
  Query,
  Route,
  Tags,
} from 'tsoa';

import BaseController from '@/components/base.controller';
import {
  IAvailableLocale,
  IAvailableMessage,
  ILocaleCreate,
  ILocaleUpdate,
  IMessageUpsert,
  ISourceCreate,
  ISourceWithMessages,
} from '@/components/locale/locale.interface';
import { ILocale } from '@/components/locale/locale.model';
import LocaleService from '@/components/locale/locale.service';
import {
  LocaleCreateValidation,
  LocaleUpdateValidation,
  SourceCreateValidation,
} from '@/components/locale/locale.validation';
import { ILocaleSource } from '@/components/locale/locale_source.model';
import { QueryParams } from '@/interfaces';

@Route('locale')
@Tags('locale')
export class LocaleController extends BaseController {
  localeService: LocaleService;

  constructor() {
    super();
    this.localeService = new LocaleService();
  }

  /**
   * @summary Get locale list
   */
  @Get('i/list')
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
  @Get('i/available')
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
  @Get('i/{id}')
  @OperationId('admin:locale:query')
  @Permissions('admin:locale:query')
  public async query(@Path() id: number): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.selectLocaleById(id);
    this.setStatus(httpStatus.OK);
    return this.response(locale);
  }

  /**
   * @summary Create locale
   */
  @Post('i')
  @Middlewares([validate(LocaleCreateValidation)])
  @OperationId('admin:locale:create')
  @Permissions('admin:locale:create')
  @CacheClear({ hashKey: 'locale:available' })
  public async create(@Body() body: ILocaleCreate): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.createLocale(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(locale);
  }

  /**
   * @summary Update locale
   */
  @Put('i/{id}')
  @Middlewares([validate(LocaleUpdateValidation)])
  @OperationId('admin:locale:edit')
  @Permissions('admin:locale:edit')
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({ hashKey: 'locale:message:available', cacheKey: (args) => args[1]?.langcode })
  public async update(
    @Path() id: number,
    @Body() body: ILocaleUpdate,
  ): Promise<IResponse<ILocale>> {
    const locale = await this.localeService.updateLocale(id, body);
    this.setStatus(httpStatus.OK);
    return this.response(locale);
  }

  /**
   * @summary Delete locale
   */
  @Delete('i/{id}')
  @OperationId('admin:locale:delete')
  @Permissions('admin:locale:delete')
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({ hashKey: 'locale:message:available:*' })
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.localeService.deleteLocale(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  /**
   * @summary Get source list.
   */
  @Get('source/list')
  @OperationId('admin:locale:source:list')
  @Permissions('admin:locale:list')
  public async listSource(
    @Header('Accept-Language') acceptLanguage: string,
    @Queries() param?: QueryParams,
  ): Promise<IResponse<SequelizePagination<ISourceWithMessages>>> {
    const list = await this.localeService.selectSourceList(
      String(param.langcode || acceptLanguage),
      param,
    );
    this.setStatus(httpStatus.OK);
    return this.response(list);
  }

  /**
   * @summary Create locale source if missing
   */
  @Post('source')
  @Middlewares([validate(SourceCreateValidation)])
  @OperationId('admin:locale:source:create')
  @Permissions('admin:locale:source:create')
  @CacheClear({ hashKey: 'locale:message:available:*' })
  public async createSourceIfMissing(
    @Body() body: ISourceCreate,
  ): Promise<IResponse<ILocaleSource>> {
    const source = await this.localeService.createSourceIfMissing(body);
    this.setStatus(httpStatus.OK);
    return this.response(source);
  }

  /**
   * @summary Get available message list
   */
  @Get('message/available')
  @OperationId('admin:locale:message:available')
  @Cacheable({ hashKey: 'locale:message:available', cacheKey: (args) => args[1] || args[0] })
  public async listAvailableMessages(
    @Header('Accept-Language') acceptLanguage: string,
    @Query() langcode?: string,
  ): Promise<IResponse<IAvailableMessage[]>> {
    const messages = await this.localeService.selectAvailableMessageList(
      langcode || acceptLanguage,
    );
    this.setStatus(httpStatus.OK);
    return this.response(messages);
  }

  /**
   * @summary Upsert messages
   */
  @Post('message/upsert')
  @OperationId('admin:locale:message:upsert')
  @Permissions('admin:locale:message:upsert')
  @CacheClear({ hashKey: 'locale:message:available:*' })
  public async upsertMessages(@Body() body: IMessageUpsert[]): Promise<IResponse<void>> {
    await this.localeService.upsertMessages(body);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default LocaleController;
