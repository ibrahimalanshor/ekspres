import { BaseError, ErrorPayload } from 'galat';

type ErrorNames =
  | 'BadRequest'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Conflict'
  | 'Unprocessable Content'
  | 'Internal Server Error';
type ErrorStatus = 400 | 401 | 403 | 409 | 422 | 500;

export class HttpError extends BaseError<ErrorNames> {
  status: ErrorStatus = 500;

  constructor(error: ErrorPayload<ErrorNames>, status: ErrorStatus = 500) {
    super(error);

    this.status = status;
  }
}
