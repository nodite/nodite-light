export interface IResponse<T> {
  error: boolean;
  httpCode: number;
  message: string;
  data?: T;
}
