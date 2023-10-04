import Joi from 'joi';

export class ErrorDetails {
  errors: Record<string, string>;

  constructor(raw: Joi.ValidationError) {
    this.errors = Object.fromEntries(
      raw.details.map((item) => [item.path, item.message]),
    );
  }
}
