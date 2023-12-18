import { Request, Response } from 'express';
import md5 from 'md5';

const API_CACHE_HAEDER: string = 'apicache-control';

// cache only HTTP response code 200 where apicache-control is not set to no-cache
const onlyStatus200 = (req: Request, res: Response) => {
  if (req.headers['apicache-control'] === 'no-cache') return false;
  return res.statusCode === 200;
};

// cache only POST requests with unique body
const onlyWithUniqueBody = (req: Request) => {
  if (req.method === 'POST' && req.body) {
    return md5(JSON.stringify(req.body));
  }
  return req.path;
};

export { API_CACHE_HAEDER, onlyStatus200, onlyWithUniqueBody };
