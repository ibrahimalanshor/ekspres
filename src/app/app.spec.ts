import { describe, expect, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';

describe('App', () => {
  test('listen to default port', async () => {
    const app = new App();

    app.listen();

    await supertest(`http://localhost:3000`).get('/').expect(404);

    app.stop();
  });

  describe.only('port', () => {
    test('default port config to 3000', () => {
      const app = new App();

      expect(app.getPort()).toEqual(3000);
    });

    test('set port', async () => {
      const app = new App();

      app.setPort(5000);

      expect(app.getPort()).toEqual(5000);

      app.listen();

      await supertest(`http://localhost:5000`).get('/').expect(404);

      app.stop();
    });
  });
});
