import express from 'express';
import { Server } from 'http';

export class App {
  private server: Server;

  listen() {
    const app = express();

    this.server = app.listen(3000);
  }

  stop() {
    this.server.close();
  }
}
