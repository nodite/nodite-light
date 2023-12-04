import { IUser } from '@components/user/user.interface';
import { UserModel } from '@components/user/user.model';
import AppError from '@core/utils/appError';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op } from 'sequelize';

export class UserService {
  public async search(user?: IUser): Promise<UserModel[]> {
    const where = {};

    if (!lodash.isEmpty(user?.email)) {
      lodash.set(where, 'email', { [Op.like]: `%${user?.email}%` });
    }

    return UserModel.findAll({ where });
  }

  public async get(id?: number): Promise<UserModel> {
    const user = await UserModel.findOne({ where: { user_id: id } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  public async getByUsername(username: string): Promise<UserModel> {
    const user = await UserModel.findOne({ where: { username } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  public async getByEmail(email: string): Promise<UserModel> {
    const user = await UserModel.findOne({ where: { email } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  public async create(user: IUser): Promise<UserModel> {
    const createdUser = await UserModel.create({ ...user });

    if (lodash.isEmpty(createdUser)) {
      throw new AppError(httpStatus.BAD_GATEWAY, 'User was not created!');
    }

    return createdUser;
  }

  public async update(id: number, user: IUser): Promise<number> {
    if (!lodash.isEmpty(user.password)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Password cannot be updated on this endpoint!',
      );
    }

    const [rows] = await UserModel.update(user, { where: { user_id: id } });
    return rows;
  }

  public async delete(id: number): Promise<number> {
    return UserModel.destroy({ where: { user_id: id } });
  }
}

export default UserService;
