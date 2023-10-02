import { Handler, Request } from 'express';
import {
  QueryForAllParser,
  QueryForSingleParser,
  ValidationError,
} from 'kueri';
import { HttpError } from '../../errors/http.error';

export function createQueryMiddleware(): {
  forAll: Handler;
  forSingle: Handler;
} {
  return {
    forAll: async (req, res, next) => {
      try {
        const parsed = await new QueryForAllParser().make(req.query);

        req.query = parsed as unknown as Request['query'];

        next();
      } catch (err) {
        if (err instanceof ValidationError) {
          return next(
            new HttpError(
              {
                name: 'BadRequest',
                message: err.message,
              },
              400,
            ),
          );
        }

        return next(err);
      }
    },
    forSingle: async (req, res, next) => {
      try {
        const parsed = await new QueryForSingleParser().make(req.query);

        req.query = parsed as unknown as Request['query'];

        next();
      } catch (err) {
        if (err instanceof ValidationError) {
          return next(
            new HttpError(
              {
                name: 'BadRequest',
                message: err.message,
              },
              400,
            ),
          );
        }

        return next(err);
      }
    },
  };
}
