import { describe, expect, jest, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';
import { NextFunction } from 'express';

describe('App', () => {
  describe('listen', () => {
    test('listen to default port', async () => {
      const app = new App();

      app.listen();

      await supertest(`http://localhost:3000`).get('/').expect(404);

      app.stop();
    });

    test('listen callback', async () => {
      const app = new App();
      const listenCallback = jest.fn((port: number) => {});

      app.listen(listenCallback);

      await supertest(`http://localhost:3000`).get('/').expect(404);

      app.stop();

      expect(listenCallback).toHaveBeenCalled();
      expect(listenCallback.mock.calls[0][0]).toBe(3000);
    });
  });

  describe('port', () => {
    test('set port', async () => {
      const app = new App();

      app.setPort(5000).listen();

      await supertest(`http://localhost:5000`).get('/').expect(404);

      app.stop();
    });
  });

  describe.only('middleware', () => {
    test('set middleware', async () => {
      const app = new App();

      const middlewares = [
        jest.fn((req, res, next: NextFunction) => {
          next();
        }),
        jest.fn((req, res, next: NextFunction) => {
          next();
        }),
      ];

      app.setMiddleware(middlewares).listen();

      await supertest(`http://localhost:3000`).get('/').expect(404);

      expect(middlewares[0]).toHaveBeenCalled();
      expect(middlewares[1]).toHaveBeenCalled();

      app.stop();
    });
  });
});
