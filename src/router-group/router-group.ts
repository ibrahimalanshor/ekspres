import { Router } from 'express';
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
      router[handler.method](handler.path, async (req, res, next) => {
        try {
          return res.json(
            await handler.handler({ body: req.body, query: req.query }),
          );
        } catch (err) {
          next(err);
        }
      });
    });

    return router;
  }

  handle(routeHandler: RouterGroupHandler): this {
    this.handlers.push(routeHandler);

    return this;
  }
}
