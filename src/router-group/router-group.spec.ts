import { describe, expect, jest, test } from '@jest/globals';
import { RouterGroup } from './router-group';
import { RouterGroupError } from '../errors/router-group.error';
import { App } from '../app/app';
import supertest from 'supertest';
import { RouterHandler } from '../router/router.types';
import { ErrorResponse } from '../app/app.types';
import { HttpError } from '../errors/http.error';
import { NextFunction } from 'express';

describe('router group', () => {
  describe('make', () => {
    test('throw if no handler', () => {
      const router = new RouterGroup();

      expect(() => router.make()).toThrow(RouterGroupError);
      expect(() => router.make()).toThrow('No handler found');
    });

    test('no throw if any handler', () => {
      const router = new RouterGroup();

      router.handle({
        path: '/',
        method: 'get',
        handler: async () => 'OK',
      });

      expect(() => router.make()).not.toThrow(RouterGroupError);
    });

    test('return router', () => {
      const router = new RouterGroup();

      router
        .handle({
          path: '/',
          method: 'get',
          handler: async () => 'OK',
        })
        .handle({
          path: '/',
          method: 'post',
          handler: async () => 'OK',
        });

      expect(typeof router.make()).toBe('function');
      expect(router.make().stack).toHaveLength(2);
    });
  });

  describe('handler', () => {
    test('called', async () => {
      const router = new RouterGroup();
      const app = new App();

      const handler = jest.fn<RouterHandler<string>>().mockResolvedValue('Ok');

      router
        .handle({
          path: '/',
          method: 'get',
          handler,
        })
        .handle({
          path: '/',
          method: 'post',
          handler,
        })
        .handle({
          path: '/',
          method: 'patch',
          handler,
        })
        .handle({
          path: '/',
          method: 'delete',
          handler,
        });

      app.setRoutes([router.make()]);

      await supertest(app.getServer()).get('/').expect(200);
      await supertest(app.getServer()).post('/').expect(200);
      await supertest(app.getServer()).patch('/').expect(200);
      await supertest(app.getServer()).delete('/').expect(200);

      expect(handler).toHaveBeenCalledTimes(4);
    });

    test('resolved value', async () => {
      const router = new RouterGroup();
      const app = new App();

      const handler = jest.fn<RouterHandler<string>>().mockResolvedValue('Ok');

      router.handle({
        path: '/',
        method: 'get',
        handler,
      });

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer()).get('/').expect(200);

      expect(res.body).toEqual('Ok');
    });
  });

  describe('middleware', () => {
    test('handler called', async () => {
      const router = new RouterGroup();
      const app = new App();

      const middlewares = [
        jest.fn((req, res, next: NextFunction) => next()),
        jest.fn((req, res, next: NextFunction) => next()),
      ];

      router.handle({
        path: '/',
        method: 'get',
        middlewares,
        handler: async () => 'Ok',
      });
      app.setRoutes([router.make()]);

      await supertest(app.getServer()).get('/').expect(200);

      expect(middlewares[0]).toHaveBeenCalled();
      expect(middlewares[1]).toHaveBeenCalled();
    });
  });

  describe('handle error', () => {
    test('internal server error', async () => {
      const router = new RouterGroup();
      const app = new App();

      const handler = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Something Error'));
      router.handle({
        path: '/',
        method: 'get',
        handler,
      });

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer()).get('/').expect(500);
      const errorRes: ErrorResponse = {
        name: 'Internal Server Error',
        message: 'Something Error',
        status: 500,
      };

      expect(res.body).toEqual(errorRes);
    });
    test('http error', async () => {
      const router = new RouterGroup();
      const app = new App();

      const handler = jest.fn<() => Promise<never>>().mockRejectedValue(
        new HttpError(
          {
            name: 'Forbidden',
            message: 'You dont have access',
          },
          403,
        ),
      );
      router.handle({
        path: '/',
        method: 'get',
        handler,
      });

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer()).get('/').expect(403);
      const errorRes: ErrorResponse = {
        message: 'You dont have access',
        name: 'Forbidden',
        status: 403,
      };
      expect(res.body).toEqual(errorRes);
    });
  });
});
