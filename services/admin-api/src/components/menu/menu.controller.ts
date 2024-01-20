import { AuthorizedRequest, Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { Cacheable, CacheClear } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import {
  Body,
  Delete,
  Get,
  Middlewares,
  OperationId,
  Path,
  Post,
  Put,
  Request,
  Route,
  Tags,
} from 'tsoa';

import BaseController from '@/components/base.controller';
import { MenuTree } from '@/components/menu/menu.interface';
import { IMenu } from '@/components/menu/menu.model';
import MenuService from '@/components/menu/menu.service';
import SaveValidation from '@/components/menu/menu.validation';

/**
 * Class MenuController.
 */
@Route('menu')
@Tags('menu')
export class MenuController extends BaseController {
  menuService: MenuService;

  constructor() {
    super();
    this.menuService = new MenuService();
  }

  /**
   * @summary List menu by user
   */
  @Get('/list')
  @OperationId('admin:menu:list')
  @Permissions('admin:menu:list')
  @Cacheable({ hashKey: 'menu:list', cacheKey: (args) => args[0]?.user?.userId })
  public async list(@Request() req: AuthorizedRequest): Promise<IResponse<IMenu[]>> {
    const menus = await this.menuService.selectMenuList(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(menus);
  }

  /**
   * @summary List menu tree by user
   */
  @Get('/tree')
  @OperationId('admin:menu:tree')
  @Cacheable({ hashKey: 'menu:tree', cacheKey: (args) => args[0]?.user?.userId })
  public async listTree(@Request() req: AuthorizedRequest): Promise<IResponse<MenuTree[]>> {
    const menuTree = await this.menuService.selectMenuTree(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(menuTree);
  }

  /**
   * @summary Get menu by id
   */
  @Get('{id}')
  @OperationId('admin:menu:query')
  @Permissions('admin:menu:query')
  @Cacheable({ hashKey: 'menu:query', cacheKey: (args) => args[0] })
  public async query(@Path() id: number): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.selectMenuById(id);
    this.setStatus(httpStatus.OK);
    return this.response(menu);
  }

  /**
   * @summary Create menu
   */
  @Post()
  @Middlewares([validate(SaveValidation)])
  @OperationId('admin:menu:create')
  @Permissions('admin:menu:create')
  @CacheClear({ hashKey: 'menu:list:*' })
  @CacheClear({ hashKey: 'menu:tree:*' })
  public async create(@Body() body: Omit<IMenu, 'menuId'>): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.create(body as IMenu);
    this.setStatus(httpStatus.CREATED);
    return this.response(menu);
  }

  /**
   * @summary Update menu
   */
  @Put('{id}')
  @Middlewares([validate(SaveValidation)])
  @OperationId('admin:menu:edit')
  @Permissions('admin:menu:edit')
  @CacheClear({ hashKey: 'menu:list:*' })
  @CacheClear({ hashKey: 'menu:tree:*' })
  @CacheClear({ hashKey: 'menu:query', cacheKey: (args) => args[0] })
  public async update(
    @Path() id: number,
    @Body() body: Omit<IMenu, 'menuId'>,
  ): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.update(id, body as IMenu);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(menu);
  }

  /**
   * @summary Delete menu
   */
  @Delete('{id}')
  @OperationId('admin:menu:delete')
  @Permissions('admin:menu:delete')
  @CacheClear({ hashKey: 'menu:list:*' })
  @CacheClear({ hashKey: 'menu:tree:*' })
  @CacheClear({ hashKey: 'menu:query', cacheKey: (args) => args[0] })
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.menuService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default MenuController;
