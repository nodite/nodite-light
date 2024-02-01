import { AuthorizedRequest, Permissions } from '@nodite-light/admin-auth';
import { type DataTree, IResponse, validate } from '@nodite-light/admin-core';
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
import { IMenuCreate, IMenuUpdate } from '@/components/menu/menu.interface';
import { IMenu } from '@/components/menu/menu.model';
import MenuService from '@/components/menu/menu.service';
import { CreateValidation, UpdateValidation } from '@/components/menu/menu.validation';

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
  @Get('list')
  @OperationId('admin:menu:list')
  @Permissions('admin:menu:list')
  public async list(@Request() req: AuthorizedRequest): Promise<IResponse<IMenu[]>> {
    const menus = await this.menuService.selectMenuList(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(menus);
  }

  /**
   * @summary List menu tree by user
   */
  @Get('tree')
  @OperationId('admin:menu:tree')
  @Cacheable({ hashKey: 'menu:tree', cacheKey: (args) => args[0]?.user?.userId })
  public async listTree(@Request() req: AuthorizedRequest): Promise<IResponse<DataTree<IMenu>[]>> {
    const tree = await this.menuService.selectMenuTree(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(tree);
  }

  /**
   * @summary Get menu by id
   */
  @Get('{id}')
  @OperationId('admin:menu:query')
  @Permissions('admin:menu:query')
  public async query(@Path() id: string): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.selectMenuById(id);
    this.setStatus(httpStatus.OK);
    return this.response(menu);
  }

  /**
   * @summary Create menu
   */
  @Post()
  @Middlewares([validate(CreateValidation)])
  @OperationId('admin:menu:create')
  @Permissions('admin:menu:create')
  @CacheClear({ hashKey: 'menu:tree:*' })
  public async create(@Body() body: IMenuCreate): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(menu);
  }

  /**
   * @summary Update menu
   */
  @Put('{id}')
  @Middlewares([validate(UpdateValidation)])
  @OperationId('admin:menu:edit')
  @Permissions('admin:menu:edit')
  @CacheClear({ hashKey: 'menu:tree:*' })
  public async update(@Path() id: string, @Body() body: IMenuUpdate): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.update(id, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(menu);
  }

  /**
   * @summary Delete menu
   */
  @Delete('{id}')
  @OperationId('admin:menu:delete')
  @Permissions('admin:menu:delete')
  @CacheClear({ hashKey: 'menu:tree:*' })
  public async delete(@Path() id: string): Promise<IResponse<void>> {
    await this.menuService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default MenuController;
