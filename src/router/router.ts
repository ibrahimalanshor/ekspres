import { RequestHandler } from 'express';
import { RouterError } from '../errors/router.error';
import { RouterMethod } from './router.types';

export class Router {
  private path: string;
  private method: RouterMethod;

  setPath(path: string): this {
    this.path = path;

    return this;
  }

  setMethod(method: RouterMethod): this {
    this.method = method;

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

    return (req, res) => {};
  }
}
