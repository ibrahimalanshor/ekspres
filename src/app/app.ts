import express, {
  Application,
  Handler,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import { Server } from 'http';
import { HttpError } from '../errors/http.error';
import { ErrorResponse } from './app.types';

export class App {
  private app: Application;
  private server: Server;
  private port: number = 3000;
  private middlewares: Handler[] = [];
  private routes: RequestHandler[] = [];

  constructor() {
    this.app = express();
  }

  listen(cb?: (port: number) => any) {
    this.middlewares.forEach((middleware) => this.app.use(middleware));
    this.routes.forEach((route) => this.app.use(route));

    this.setupErrorHandler();

    this.server = this.app.listen(this.port, () => {
      if (cb) {
        cb(this.port);
      }
    });
  }

  stop() {
    this.server.close();
  }

  setPort(port: number): this {
    this.port = port;

    return this;
  }

  setMiddlewares(middlewares: Handler[]): this {
    this.middlewares = middlewares;

    return this;
  }

  setRoutes(routes: RequestHandler[]): this {
    this.routes = routes;

    return this;
  }

  setupErrorHandler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof HttpError) {
          const errorParsed: ErrorResponse = {
            status: err.status,
            message: err.message,
            name: err.name,
            ...(err.details
              ? {
                  details: err.details,
                }
              : {}),
          };

          return res.status(errorParsed.status).json(errorParsed);
        }

        const errorParsed: ErrorResponse = {
          status: 500,
          name: 'Internal Server Error',
          message: err instanceof Error ? err.message : 'Internal Server Error',
        };

        return res.status(errorParsed.status).json(errorParsed);
      },
    );
  }
}
