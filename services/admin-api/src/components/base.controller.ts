import { IResponse } from '@nodite-light/admin-core';
import { Controller } from 'tsoa';

/**
 * Class BaseController.
 */
export abstract class BaseController extends Controller {
  protected response<T>(data?: T): IResponse<T> {
    return {
      error: false,
      httpCode: this.getStatus() || 200,
      message: 'success',
      data,
    } as IResponse<T>;
  }
}

export default BaseController;
