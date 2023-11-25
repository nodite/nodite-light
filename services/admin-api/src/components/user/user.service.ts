import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import httpStatus from 'http-status';

import { IUser } from './user.interface';

let userStorage: Array<IUser> = [
  {
    id: '1',
    name: 'Oscaner Miao',
    email: 'oscaner1997@gmail.com',
  },
];

export type UserCreationParams = Pick<IUser, 'name' | 'email'>;

export class UserService {
  public get(id: string, name?: string): IUser {
    logger.debug(`Sent user.id ${id}/${name}`);
    return [...userStorage].pop() as IUser;
  }

  public create(params: UserCreationParams): IUser {
    if (userStorage.push(params as IUser)) {
      logger.debug(`User created: %O`, params);
      return params as IUser;
    }
    throw new AppError(httpStatus.BAD_GATEWAY, 'User was not created!');
  }

  public update(id: string, user: IUser): IUser {
    userStorage = userStorage.map((u) => (u.id === id ? { ...u, ...user } : u));
    return this.get(id);
  }

  public delete(id: string): boolean {
    userStorage = userStorage.filter((user) => user.id !== id);
    logger.debug(`User ${id} has been removed`);
    return true;
  }
}
