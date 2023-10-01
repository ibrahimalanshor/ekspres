import { RequestHandler, Router as ExpressRouter } from 'express';
import { RouterError } from '../errors/router.error';
import { RouterHandler, RouterMethod } from './router.types';

export class Router<T> {
  private path: string;
  private method: RouterMethod;
  private handler: RouterHandler<T>;

  setPath(path: string): this {
    this.path = path;

    return this;
  }

  setMethod(method: RouterMethod): this {
    this.method = method;

    return this;
  }

  handle(handler: RouterHandler<T>): this {
    this.handler = handler;

    return this;
  }

  make(): RequestHandler {
    if (!this.path) {
      throw new RouterError({
        name: 'PATH_UNSET',
        message: 'Path is unset',
      });
    }

    if (!this.method) {
      throw new RouterError({
        name: 'METHOD_UNSET',
        message: 'Method is unset',
      });
    }

    if (!this.handler) {
      throw new RouterError({
        name: 'HANDLER_UNSET',
        message: 'Handler is unset',
      });
    }

    const router = ExpressRouter();

    router.route(this.path)[this.method](async (req, res) => {
      const data = await this.handler({ req, res });

      return res.json(data);
    });

    return router;
  }
}
