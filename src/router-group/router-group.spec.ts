import { describe, expect, test } from '@jest/globals';
import { RouterGroup } from './router-group';
import { RouterGroupError } from '../errors/router-group.error';

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
      });

      expect(() => router.make()).not.toThrow(RouterGroupError);
    });

    test('return router', () => {
      const router = new RouterGroup();

      router
        .handle({
          path: '/',
          method: 'get',
        })
        .handle({
          path: '/',
          method: 'post',
        });

      expect(typeof router.make()).toBe('function');
      expect(router.make().stack).toHaveLength(2);
    });
  });
});
