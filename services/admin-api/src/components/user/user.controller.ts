import BaseController from '@components/base.controller';
import { IUser } from '@components/user/user.interface';
import { UserService } from '@components/user/user.service';
import { CreateUserValidation } from '@components/user/user.validation';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import { IResponse } from '@core/interfaces/httpResponse';
import validation from '@core/middlewares/validate.middleware';
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
  Queries,
  Request,
  Route,
  Tags,
} from 'tsoa';

@Route('user')
@Tags('User')
export class UserController extends BaseController {
  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * @summary Get all users
   */
  @Get('/list')
  public async list(@Queries() user?: IUser): Promise<IResponse<IUser[]>> {
    const models = await this.userService.search(user);
    this.setStatus(httpStatus.OK);
    return this.response(models.map((m) => m.toJSON<IUser>()));
  }

  /**
   * @summary Get current user
   */
  @Get()
  public async curr(
    @Request() req: AuthorizedRequest,
  ): Promise<IResponse<IUser>> {
    const result = await this.userService.get(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(result.toJSON<IUser>());
  }

  /**
   * @summary Get user by id
   */
  @Get('{userId}')
  @OperationId('admin:user:get')
  public async get(@Path() userId: number): Promise<IResponse<IUser>> {
    const result = await this.userService.get(userId);
    this.setStatus(httpStatus.OK);
    return this.response(result.toJSON<IUser>());
  }

  /**
   * @summary Create user
   */
  @Post()
  @Middlewares([validation(CreateUserValidation)])
  @OperationId('admin:user:create')
  public async create(@Body() body: IUser): Promise<IResponse<IUser>> {
    const result = await this.userService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(result.toJSON<IUser>());
  }

  /**
   * @summary Update user
   */
  @Put('{userId}')
  @OperationId('admin:user:update')
  public async update(
    @Path() userId: number,
    @Body() body: IUser,
  ): Promise<IResponse<number>> {
    const result = await this.userService.update(userId, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(result);
  }

  /**
   * @summary Delete user
   */
  @Delete('{userId}')
  @OperationId('admin:user:delete')
  public async delete(@Path() userId: number): Promise<IResponse<number>> {
    const result = await this.userService.delete(userId);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(result);
  }
}

export default UserController;
