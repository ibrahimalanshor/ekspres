import { describe, expect, jest, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';

describe('App', () => {
  describe.only('listen', () => {
    test('listen to default port', async () => {
      const app = new App();

      app.listen();

      await supertest(`http://localhost:3000`).get('/').expect(404);

      app.stop();
    });

    test.only('listen callback', async () => {
      const app = new App();
      const listenCallback = jest.fn((port: number) => {});

      app.listen(listenCallback);

      await supertest(`http://localhost:3000`).get('/').expect(404);

      app.stop();

      expect(listenCallback).toHaveBeenCalled();
      expect(listenCallback.mock.calls[0][0]).toBe(3000);
    });
  });

  describe('port', () => {
    test('default port config to 3000', () => {
      const app = new App();

      expect(app.getPort()).toBe(3000);
    });

    test('set port', async () => {
      const app = new App();

      app.setPort(5000);

      expect(app.getPort()).toBe(5000);

      app.listen();

      await supertest(`http://localhost:5000`).get('/').expect(404);

      app.stop();
    });
  });
});
