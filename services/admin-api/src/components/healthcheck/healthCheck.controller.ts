import { Request, Response } from 'express';
import httpStatus from 'http-status';

const healthcheck = (req: Request, res: Response) => {
  res.status(httpStatus.OK);
  res.send({ status: 'OK', data: new Date().toJSON() });
};

export default healthcheck;
