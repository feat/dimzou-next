/**
 * Test the request function
 */
import moxios from 'moxios';
import request, { instance, baseURL } from '../request';

describe('request', () => {
  // Before each test, stub the fetch function
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  describe('stubbing successful response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      moxios.stubRequest(`${baseURL}/thisurliscorrect`, {
        status: 200,
        responseText: '{"hello": "world"}',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should format the response correctly', (done) => {
      request({
        url: '/thisurliscorrect',
      })
        .catch(done)
        .then((json) => {
          expect(json.hello).toBe('world');
          done();
        });
    });
  });

  describe('stubbing 204 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      moxios.stubRequest(`${baseURL}/thisurliscorrect`, {
        status: 204,
        statusText: 'No Content',
        responseText: '',
      });
    });

    it('should return null on 204 response', (done) => {
      request({
        url: '/thisurliscorrect',
      })
        .catch(done)
        .then((json) => {
          expect(json).toBeUndefined();
          done();
        });
    });
  });

  describe('stubbing error response', () => {
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      moxios.stubRequest(`${baseURL}/thisdoesntexist`, {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-type': 'application/json',
        },
      });
    });

    it('should catch errors', (done) => {
      request({
        url: `${baseURL}/thisdoesntexist`,
      }).catch((err) => {
        expect(err.response.status).toBe(404);
        expect(err.response.statusText).toBe('Not Found');
        done();
      });
    });
  });

  describe('stubbing api error response', () => {
    beforeEach(() => {
      moxios.stubRequest(`${baseURL}/thisreturnerror`, {
        status: 400,
        headers: {
          'Content-type': 'application/json',
        },
        responseText:
          '{"code": "API_ERROR", "message": "Api error description", "data": { "key": 1 } }',
      });
    });

    it('should return api error instance if has related info', (done) => {
      request({
        url: `${baseURL}/thisreturnerror`,
      }).catch((err) => {
        expect(err.code).toBe('API_ERROR');
        expect(err.message).toBe('Api error description');
        expect(err.data).toEqual({ key: 1 });
        done();
      });
    });
  });
});
