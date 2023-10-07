import { describe, test } from '@jest/globals';
import expect from 'expect';
import { createRequestValidator } from './request-validator';
import { App } from '../../app/app';
import { Router } from '../../router/router';
import supertest from 'supertest';
import { Request, RequestPath } from './request';
import Joi, { Schema } from 'joi';

describe('request validator', () => {
  describe('createRequestValidator', () => {
    test('return handler', () => {
      class TestRequest extends Request {
        schema(): Joi.Schema {
          return Joi.object({
            name: Joi.string().required(),
          });
        }
      }

      expect(typeof createRequestValidator(TestRequest)).toBe('function');
    });

    test('throw 422', async () => {
      const app = new App();
      const router = new Router();

      class TestRequest extends Request {
        schema(): Joi.Schema {
          return Joi.object({
            name: Joi.string().required(),
          });
        }
      }

      app.setRoutes([
        router
          .setPath('/')
          .setMethod('post')
          .addMiddlewares([createRequestValidator(TestRequest)])
          .handle(async () => 'Ok')
          .make(),
      ]);

      await supertest(app.getServer()).post('/').expect(422);
    });

    test('throw validation error', async () => {
      const app = new App();
      const router = new Router();

      class TestRequest extends Request {
        schema(): Joi.Schema {
          return Joi.object({
            name: Joi.string().required(),
          });
        }
      }

      app.setRoutes([
        router
          .setPath('/')
          .setMethod('post')
          .addMiddlewares([createRequestValidator(TestRequest)])
          .handle(async () => 'Ok')
          .make(),
      ]);

      const res = await supertest(app.getServer()).post('/').expect(422);
      const detailsError = {
        name: '"name" is required',
      };

      expect(res.body).toHaveProperty('details');
      expect(res.body.details).toEqual(detailsError);
    });

    test('return validated', async () => {
      const app = new App();
      const router = new Router();

      class TestRequest extends Request {
        schema(): Joi.Schema {
          return Joi.object({
            name: Joi.string().required(),
          });
        }
      }

      app.setRoutes([
        router
          .setPath('/')
          .setMethod('post')
          .addMiddlewares([createRequestValidator(TestRequest)])
          .handle(async (context) => context?.body)
          .make(),
      ]);

      const res = await supertest(app.getServer())
        .post('/')
        .send({
          name: 'Test',
          ignore: 'ignore',
        })
        .expect(200);
      const body = {
        name: 'Test',
      };

      expect(res.body).toEqual(body);
    });

    test('validate params', async () => {
      const app = new App();
      const router = new Router();

      class TestRequest extends Request {
        public path: RequestPath = 'params';

        schema(): Joi.Schema {
          return Joi.object({
            id: Joi.number().required(),
          });
        }
      }

      app.setRoutes([
        router
          .setPath('/:id')
          .setMethod('get')
          .addMiddlewares([createRequestValidator(TestRequest)])
          .handle(async () => 'Ok')
          .make(),
      ]);

      const res = await supertest(app.getServer()).get('/NaN').expect(422);
      const detailsError = {
        id: '"id" must be a number',
      };

      expect(res.body).toHaveProperty('details');
      expect(res.body.details).toEqual(detailsError);
    });
  });

  describe('Request', () => {
    test('callable', () => {
      class CreateUserRequest extends Request {
        schema(): Schema {
          return Joi.object({
            email: Joi.string().email().required(),
          });
        }
      }

      expect(typeof CreateUserRequest).toBe('function');
    });

    test('schema callable', () => {
      class CreateUserRequest extends Request {
        schema(): Schema {
          return Joi.object({
            email: Joi.string().email().required(),
          });
        }
      }

      expect(typeof CreateUserRequest.prototype.schema).toBe('function');
    });

    test('throw validation error', async () => {
      const app = new App();
      const router = new Router();

      class CreateUserRequest extends Request {
        schema(): Schema {
          return Joi.object({
            email: Joi.string().email().required(),
          });
        }
      }

      app.setRoutes([
        router
          .setPath('/')
          .setMethod('post')
          .addMiddlewares([createRequestValidator(CreateUserRequest)])
          .handle(async () => 'Ok')
          .make(),
      ]);

      const res = await supertest(app.getServer()).post('/').expect(422);
      const detailsError = {
        email: '"email" is required',
      };

      expect(res.body).toHaveProperty('details');
      expect(res.body.details).toEqual(detailsError);
    });
  });
});
