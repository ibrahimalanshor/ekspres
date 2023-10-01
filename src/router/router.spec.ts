import { describe, expect, jest, test } from '@jest/globals';
import { Router } from './router';
import { RouterError } from '../errors/router.error';
import { RouterHandler } from './router.types';
import { Router as ExpressRouter } from 'express';

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

  describe.only('handler', () => {
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
});
