import { describe } from '@jest/globals';
import expect from 'expect';
import { createRequestValidator } from './request-validator';

describe.only('request validator', () => {
  describe.only('createRequestValidator', () => {
    expect(typeof createRequestValidator()).toBe('function');
  });
});
