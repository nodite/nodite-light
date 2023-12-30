import { AuthorizedRequest } from '@nodite-light/admin-auth/lib/interfaces/authorizedRequest';
import { Permissions } from '@nodite-light/admin-auth/lib/middlewares/authorized.middleware';
import { IResponse } from '@nodite-light/admin-core/lib/interfaces/httpResponse';
import validate from '@nodite-light/admin-core/lib/middlewares/validate.middleware';
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
import { IMenu, MenuTree } from '@/components/menu/menu.interface';
import { MenuService } from '@/components/menu/menu.service';
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
  public async listTree(@Request() req: AuthorizedRequest): Promise<IResponse<MenuTree[]>> {
    const menuTree = await this.menuService.selectMenuTree(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(menuTree);
  }

  /**
   * @summary Create menu
   */
  @Post()
  @Middlewares([validate(SaveValidation)])
  @OperationId('admin:menu:create')
  @Permissions('admin:menu:create')
  public async create(@Body() body: IMenu): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(menu);
  }

  /**
   * @summary Delete menu
   */
  @Delete('{id}')
  @OperationId('admin:menu:delete')
  @Permissions('admin:menu:delete')
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.menuService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  /**
   * @summary Update menu
   */
  @Put('{id}')
  @Middlewares([validate(SaveValidation)])
  @OperationId('admin:menu:edit')
  @Permissions('admin:menu:edit')
  public async update(@Path() id: number, @Body() body: IMenu): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.update(id, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(menu);
  }
}

export default MenuController;
