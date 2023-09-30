import express, { Handler } from 'express';
import { Server } from 'http';

export class App {
  private server: Server;
  private port: number = 3000;
  private middlewares: Handler[];

  listen(cb?: (port: number) => any) {
    const app = express();

    this.middlewares.forEach((middleware) => app.use(middleware));

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

  setMiddleware(middlewares: Handler[]): this {
    this.middlewares = middlewares;

    return this;
  }
}
