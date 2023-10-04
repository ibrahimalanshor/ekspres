import Joi from 'joi';

export abstract class Request {
  abstract schema(): Joi.Schema;
}
