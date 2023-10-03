import { Router } from 'express';
import { RouterGroupError } from '../errors/router-group.error';
import { RouteGroupHandler } from './router-group.types';

export class RouterGroup {
  handlers: RouteGroupHandler[] = [];

  make(): Router {
    if (!this.handlers.length) {
      throw new RouterGroupError({
        name: 'NO_HANDLER',
        message: 'No handler found',
      });
    }

    const router = Router();

    this.handlers.forEach((handler) => {
      router[handler.method](handler.path, async (req, res, next) => {
        try {
          return res.json(await handler.handler({ req, res }));
        } catch (err) {
          next(err);
        }
      });
    });

    return router;
  }

  handle(routeHandler: RouteGroupHandler): this {
    this.handlers.push(routeHandler);

    return this;
  }
}
