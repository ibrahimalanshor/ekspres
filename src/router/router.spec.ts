import { describe, expect, jest, test } from '@jest/globals';
import { Router } from './router';
import { RouterError } from '../errors/router.error';
import { RouterHandler } from './router.types';
import { request } from 'express';
import { App } from '../app/app';
import supertest from 'supertest';
import { ErrorResponse } from '../app/app.types';
import { HttpError } from '../errors/http.error';

describe.only('Router', () => {
  describe('path', () => {
    test('throw if path unset', () => {
      const router = new Router();

      expect(() => router.make()).toThrow(RouterError);
      expect(() => router.make()).toThrow('Path is unset');
    });

    test('set path', () => {
      const router = new Router();

      router.setPath('/');

      expect(() => router.make()).not.toThrow('Path is unset');
    });
  });

  describe('method', () => {
    test('throw if method unset', () => {
      const router = new Router();

      router.setPath('/');

      expect(() => router.make()).toThrow(RouterError);
      expect(() => router.make()).toThrow('Method is unset');
    });

    test('set method', () => {
      const router = new Router();

      router.setPath('/');
      router.setMethod('get');

      expect(() => router.make()).not.toThrow('Method is unset');
    });
  });

  describe('handler', () => {
    test('throw if handler unset', () => {
      const router = new Router();

      router.setPath('/');
      router.setMethod('get');

      expect(() => router.make()).toThrow(RouterError);
      expect(() => router.make()).toThrow('Handler is unset');
    });

    test('set handler', () => {
      const router = new Router<string>();
      const handler = jest
        .fn<RouterHandler<string>>()
        .mockResolvedValue('test');

      router.setPath('/');
      router.setMethod('get');
      router.handle(handler);

      expect(() => router.make()).not.toThrow(RouterError);
      expect(() => router.make()).not.toThrow('Handler is unset');
    });
  });

  describe('make', () => {
    test('resolved value', async () => {
      const router = new Router<string>();
      const app = new App();

      const handler = jest
        .fn<RouterHandler<string>>()
        .mockResolvedValue('test');
      router.setPath('/').setMethod('get').handle(handler);

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer()).get('/').expect(200);

      expect(res.body).toEqual('test');
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('handle error', () => {
    test('internal server error', async () => {
      const router = new Router();
      const app = new App();

      const handler = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Something Error'));
      router.setPath('/').setMethod('get').handle(handler);

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
      const router = new Router();
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
      router.setPath('/').setMethod('get').handle(handler);

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
