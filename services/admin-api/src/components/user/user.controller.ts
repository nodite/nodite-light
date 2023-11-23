import { IUser } from '@components/user/user.interface';
import {
  create,
  deleteById,
  read,
  update,
} from '@components/user/user.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const createUser = (req: Request, res: Response) => {
  const user = req.body as IUser;
  create(user);
  res.status(httpStatus.CREATED);
  res.send({ message: 'Created' });
};

const readUser = (req: Request, res: Response) => {
  res.status(httpStatus.OK);
  res.send({ message: 'Read', output: read(req.params.id) });
};

const updateUser = (req: Request, res: Response) => {
  const user = req.body as IUser;
  update(user);
  res.status(httpStatus.OK);
  res.send({ message: 'Updated' });
};

const deleteUser = (req: Request, res: Response) => {
  deleteById(req.params.email);
  res.status(httpStatus.ACCEPTED);
  res.send({ message: 'Removed' });
};

export { createUser, deleteUser, readUser, updateUser };
