import { AuthorizedRequest, Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { Middlewares, OperationId, Post, Query, Request, Route, Tags } from 'tsoa';

import BaseController from '@/components/base.controller';
import CacheService from '@/components/cache/cache.service';
import { CacheInvalidateValidation } from '@/components/cache/cache.validate';

@Route('cache')
@Tags('cache')
export class CacheController extends BaseController {
  cacheService: CacheService;

  constructor() {
    super();
    this.cacheService = new CacheService();
  }

  /**
   * @summary Clear cache
   */
  @Post('invalidate')
  @Middlewares([validate(CacheInvalidateValidation)])
  @OperationId('admin:cache:invalidate')
  @Permissions('admin:cache:invalidate')
  public async invalidate(
    @Query() type: string,
    @Request() req: AuthorizedRequest,
  ): Promise<IResponse<void>> {
    await this.cacheService.clearAllCache(type, req.user?.userId);
    this.setStatus(200);
    return this.response();
  }
}

export default CacheController;
