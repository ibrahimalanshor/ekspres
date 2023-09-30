import express from 'express';
import { Server } from 'http';

export class App {
  private server: Server;
  private port: number = 3000;

  listen() {
    const app = express();

    this.server = app.listen(this.port);
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
