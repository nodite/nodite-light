import BaseController from '@components/base.controller';
import { IMenu, MenuTree } from '@components/menu/_iac/menu.interface';
import { MenuService } from '@components/menu/menu.service';
import CreateMenuValidation from '@components/menu/menu.validation';
import { AuthorizedRequest } from '@nodite-light/admin-auth/lib/interfaces/authorizedRequest';
import { Permissions } from '@nodite-light/admin-auth/lib/middlewares/authorized.middleware';
import { IResponse } from '@nodite-light/admin-core/lib/interfaces/httpResponse';
import validate from '@nodite-light/admin-core/lib/middlewares/validate.middleware';
import httpStatus from 'http-status';
import { Body, Get, Middlewares, OperationId, Post, Request, Route, Tags } from 'tsoa';

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
  @Permissions('admin:menu:list')
  public async listTree(@Request() req: AuthorizedRequest): Promise<IResponse<MenuTree[]>> {
    const menuTree = await this.menuService.selectMenuTree(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(menuTree);
  }

  /**
   * @summary Create menu
   */
  @Post()
  @Middlewares([validate(CreateMenuValidation)])
  @OperationId('admin:menu:create')
  @Permissions('admin:menu:create')
  public async create(@Body() body: IMenu): Promise<IResponse<IMenu>> {
    const menu = await this.menuService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(menu.toJSON<IMenu>());
  }
}

export default MenuController;
