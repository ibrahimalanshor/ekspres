import { describe, expect, jest, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';
import { NextFunction, Request, Response, Router } from 'express';

describe('App', () => {
  describe('listen', () => {
    test('listen to default port', async () => {
      const app = new App();

      app.listen();

      try {
        await supertest(`http://localhost:3000`).get('/').expect(404);
      } finally {
        app.stop();
      }
    });

    test('listen callback', async () => {
      const app = new App();
      const listenCallback = jest.fn((port: number) => {});

      app.listen(listenCallback);

      try {
        await supertest(`http://localhost:3000`).get('/').expect(404);
      } finally {
        app.stop();
      }

      expect(listenCallback).toHaveBeenCalled();
      expect(listenCallback.mock.calls[0][0]).toBe(3000);
    });
  });

  describe('port', () => {
    test('set port', async () => {
      const app = new App();

      app.setPort(5000).listen();

      try {
        await supertest(`http://localhost:5000`).get('/').expect(404);
      } finally {
        app.stop();
      }
    });
  });

  describe('middleware', () => {
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

      app.setMiddlewares(middlewares).listen();

      try {
        await supertest(`http://localhost:3000`).get('/').expect(404);

        expect(middlewares[0]).toHaveBeenCalled();
        expect(middlewares[1]).toHaveBeenCalled();
      } finally {
        app.stop();
      }
    });
  });

  describe('routes', () => {
    test('set routes', async () => {
      const app = new App();

      const testRoute = Router();
      testRoute
        .route('/')
        .get((req, res) => res.json('Get'))
        .post((req, res) => res.json('Post'))
        .patch((req, res) => res.json('Patch'))
        .delete((req, res) => res.json('Delete'));

      const routes = [testRoute];

      app.setRoutes(routes).listen();

      try {
        await supertest(`http://localhost:3000`).get('/').expect(200);
        await supertest(`http://localhost:3000`).post('/').expect(200);
        await supertest(`http://localhost:3000`).patch('/').expect(200);
        await supertest(`http://localhost:3000`).delete('/').expect(200);
      } finally {
        app.stop();
      }
    });
  });
});
