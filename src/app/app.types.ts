import { HttpError } from '../errors/http.error';

export interface ErrorResponse {
  status: HttpError['status'];
  name: HttpError['name'];
  message: HttpError['message'];
  details?: any;
}
