import express from 'express';
import { Server } from 'http';

export class App {
  private server: Server;
  private port: number = 3000;

  listen(cb?: (port: number) => any) {
    const app = express();

    this.server = app.listen(this.port, () => {
      if (cb) {
        cb(this.port);
      }
    });
  }

  stop() {
    this.server.close();
  }

  getPort(): number {
    return this.port;
  }

  setPort(port: number) {
    this.port = port;
  }
}
