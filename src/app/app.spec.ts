import { describe, expect, jest, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';
import { NextFunction, Router } from 'express';
import { ErrorResponse } from './app.types';
import { HttpError } from '../errors/http.error';
import { Server } from 'http';

describe.only('App', () => {
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

  describe('server', () => {
    test('get server object', () => {
      expect(new App().getServer()).toBeInstanceOf(Server);
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
        await supertest(app.getServer()).get('/').expect(404);

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
        await supertest(app.getServer()).get('/').expect(200);
        await supertest(app.getServer()).post('/').expect(200);
        await supertest(app.getServer()).patch('/').expect(200);
        await supertest(app.getServer()).delete('/').expect(200);
      } finally {
        app.stop();
      }
    });
  });

  describe('error', () => {
    test('throw 500 error', async () => {
      const router = Router();
      const app = new App().setRoutes([
        router.get('/', (req, res) => {
          throw new Error('Something Error');
        }),
      ]);

      app.listen();

      try {
        const res = await supertest(app.getServer()).get('/').expect(500);
        const errorRes: ErrorResponse = {
          name: 'Internal Server Error',
          message: 'Something Error',
          status: 500,
        };

        expect(res.body).toEqual(errorRes);
      } finally {
        app.stop();
      }
    });

    test('throw http error', async () => {
      const router = Router();

      const forbiddenError = new HttpError(
        {
          name: 'Forbidden',
          message: 'You dont have access',
        },
        403,
      );
      const unprocessableEntityError = new HttpError(
        {
          name: 'Unprocessable Content',
          message: 'Invalid payload',
          details: [
            {
              path: '/',
              value: null,
            },
          ],
        },
        422,
      );

      const app = new App().setRoutes([
        router.get('/', (req, res) => {
          throw forbiddenError;
        }),
        router.post('/', (req, res) => {
          throw unprocessableEntityError;
        }),
      ]);

      app.listen();

      try {
        const forbiddenRes = await supertest(app.getServer())
          .get('/')
          .expect(403);
        const forbiddenErrorRes: ErrorResponse = {
          message: forbiddenError.message,
          name: forbiddenError.name,
          status: forbiddenError.status,
        };

        expect(forbiddenRes.body).toEqual(forbiddenErrorRes);

        const unprocessableEntityRes = await supertest(app.getServer())
          .post('/')
          .expect(422);
        const unprocessableErrorRes: ErrorResponse = {
          message: unprocessableEntityError.message,
          name: unprocessableEntityError.name,
          status: unprocessableEntityError.status,
          details: unprocessableEntityError.details,
        };

        expect(unprocessableEntityRes.body).toEqual(unprocessableErrorRes);
      } finally {
        app.stop();
      }
    });
  });
});
