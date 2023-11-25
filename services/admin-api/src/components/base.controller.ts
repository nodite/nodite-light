import { IResponse } from '@core/interfaces/httpResponse';
import { Controller } from 'tsoa';

export abstract class BaseController extends Controller {
  protected formatResponse<T>(data: T): IResponse<T> {
    return {
      error: false,
      httpCode: this.getStatus() || 200,
      message: 'success',
      data,
    } as IResponse<T>;
  }
}

export default BaseController;
