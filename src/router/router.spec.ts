import { describe, expect, test } from '@jest/globals';
import { Router } from './router';
import { RouterError } from '../errors/router.error';

describe.only('Router', () => {
  // test('set method', () => {
  //     expect(Router.prototype.setMethod).toBeDefined()
  //     expect(typeof Router.prototype.setMethod).toBe('function')
  // })
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

  describe.only('method', () => {
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
});
