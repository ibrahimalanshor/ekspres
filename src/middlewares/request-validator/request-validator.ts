import { Handler } from 'express';
import Joi from 'joi';
import { HttpError } from '../../errors/http.error';
import { ErrorDetails } from './error-details';
import { Request } from './request';

export function createRequestValidator(
  RequestClass: new () => Request,
): Handler {
  const request = new RequestClass();

  async function validateBody(
    body: Record<string, any>,
  ): Promise<Record<string, any>> {
    try {
      return await request.schema().validateAsync(body, {
        allowUnknown: true,
        stripUnknown: true,
      });
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        throw new ErrorDetails(err);
      }

      throw err;
    }
  }

  return async (req, res, next) => {
    try {
      req.body = await validateBody(req.body);

      next();
    } catch (err) {
      if (err instanceof ErrorDetails) {
        return next(
          new HttpError(
            {
              name: 'Unprocessable Content',
              message: 'Validation Error',
              details: err.errors,
            },
            422,
          ),
        );
      }

      return next(
        new HttpError({
          name: 'Unprocessable Content',
          message: 'Validation Error',
        }),
      );
    }
  };
}
