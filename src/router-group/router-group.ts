import { Router, Request, Response, NextFunction } from 'express';
import { RouterGroupError } from '../errors/router-group.error';
import { RouterGroupHandler } from './router-group.types';

export class RouterGroup {
  handlers: RouterGroupHandler[] = [];

  make(): Router {
    if (!this.handlers.length) {
      throw new RouterGroupError({
        name: 'NO_HANDLER',
        message: 'No handler found',
      });
    }

    const router = Router();

    this.handlers.forEach((handler) => {
      const resolver = async (
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          return res.json(
            await handler.handler({
              body: req.body,
              query: req.query,
              params: req.params,
            }),
          );
        } catch (err) {
          next(err);
        }
      };

      router[handler.method](handler.path, [
        ...(handler.middlewares ?? []),
        resolver,
      ]);
    });

    return router;
  }

  handle(routeHandler: RouterGroupHandler): this {
    this.handlers.push(routeHandler);

    return this;
  }
}
