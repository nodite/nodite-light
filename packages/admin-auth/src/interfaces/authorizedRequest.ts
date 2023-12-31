import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    email: string;
    jti?: string;
  };
}
