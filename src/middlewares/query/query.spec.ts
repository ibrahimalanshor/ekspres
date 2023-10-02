import { describe, expect, test } from '@jest/globals';
import { App } from '../../app/app';
import { Router } from '../../router/router';
import { createQueryMiddleware } from './query';
import supertest from 'supertest';
import { ErrorResponse } from '../../app/app.types';

describe('query', () => {
  test('return middlewares object', () => {
    expect(typeof createQueryMiddleware).toBe('function');
    expect(createQueryMiddleware()).toHaveProperty('forAll');
    expect(createQueryMiddleware()).toHaveProperty('forSingle');
    expect(typeof createQueryMiddleware().forAll).toBe('function');
    expect(typeof createQueryMiddleware().forSingle).toBe('function');
  });

  describe('query for all', () => {
    test('throw query error', async () => {
      const app = new App();
      const router = new Router();

      router
        .setPath('/')
        .setMethod('get')
        .addMiddlewares([createQueryMiddleware().forAll])
        .handle(async (context) => context?.req.query);

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer())
        .get('/')
        .query({ page: 'invalid' })
        .expect(400);
      const error: ErrorResponse = {
        name: 'BadRequest',
        message: 'page must be an object',
        status: 400,
      };

      expect(res.body).toEqual(error);
    });

    test('return query object', async () => {
      const app = new App();
      const router = new Router();

      router
        .setPath('/')
        .setMethod('get')
        .addMiddlewares([createQueryMiddleware().forAll])
        .handle(async (context) => context?.req.query);

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer())
        .get('/')
        .query({ include: 'user,profile' })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          include: ['user', 'profile'],
        }),
      );
    });
  });

  describe('query for single', () => {
    test('throw query error', async () => {
      const app = new App();
      const router = new Router();

      router
        .setPath('/')
        .setMethod('get')
        .addMiddlewares([createQueryMiddleware().forSingle])
        .handle(async (context) => context?.req.query);

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer())
        .get('/')
        .query({ include: [1, 2, 3] })
        .expect(400);
      const error: ErrorResponse = {
        name: 'BadRequest',
        message: 'include must be a string',
        status: 400,
      };

      expect(res.body).toEqual(error);
    });

    test('return query object', async () => {
      const app = new App();
      const router = new Router();

      router
        .setPath('/')
        .setMethod('get')
        .addMiddlewares([createQueryMiddleware().forSingle])
        .handle(async (context) => context?.req.query);

      app.setRoutes([router.make()]);

      const res = await supertest(app.getServer())
        .get('/')
        .query({ include: 'user,profile' })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          include: ['user', 'profile'],
        }),
      );
    });
  });
});
