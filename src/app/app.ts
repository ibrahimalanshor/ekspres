import express, { Handler, RequestHandler } from 'express';
import { Server } from 'http';

export class App {
  private server: Server;
  private port: number = 3000;
  private middlewares: Handler[] = [];
  private routes: RequestHandler[] = [];

  listen(cb?: (port: number) => any) {
    const app = express();

    this.middlewares.forEach((middleware) => app.use(middleware));
    this.routes.forEach((route) => app.use(route));

    this.server = app.listen(this.port, () => {
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
}
