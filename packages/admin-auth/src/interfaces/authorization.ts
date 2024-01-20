import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    email: string;
    jti?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UserIdDetector<T = any[]> {
  (args: T): number;
}

export interface PermissionOptions {
  selfBypass?: boolean;
  userIdDetector?: UserIdDetector;
}
