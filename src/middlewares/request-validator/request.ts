import Joi from 'joi';

export type RequestPath = 'query' | 'params' | 'body';

export abstract class Request {
  abstract schema(): Joi.Schema;

  public path: RequestPath = 'body';
}
