import { describe, expect, jest, test } from '@jest/globals';
import { RouterGroup } from './router-group';
import { RouterGroupError } from '../errors/router-group.error';
import { App } from '../app/app';
import supertest from 'supertest';
import { RouterHandler } from '../router/router.types';

// new RouterGroup(handler)
//     .handle(handler => ({
//         path: '/',
//         method: 'get',
//         handler: handler.getAll
//     }))
//     .handle(handler => ({
//         path: '/',
//         method: 'post',
//         handler: handler.createAll
//     }))

describe.only('router group', () => {
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

  describe.only('handler', () => {
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
  });
});
