import { NextFunction, Request, Response } from 'express';
import { Interceptor } from './auth.interceptor';
import { Auth } from '../services/auth.js';
// Import { HttpError } from '../types/http.error';

jest.mock('../services/auth', () => ({
  Auth: {
    verifyAndGetPayload: jest.fn().mockResolvedValue('someId'),
  },
}));

describe('Given the AuthInterceptor middleware', () => {
  describe('When it is instantiated', () => {
    const req = {
      get: jest.fn().mockReturnValueOnce('bearer token'),
      body: {},
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const interceptor = new Interceptor();

    test('should successfully extract and verify token', () => {
      (Auth.verifyAndGetPayload as jest.Mock).mockReturnValueOnce({
        id: 'someId',
      });

      interceptor.authorization(req, res, next);

      expect(req.body.id).toBe('someId');
      expect(next).toHaveBeenCalled();
    });
    describe('When it is instantiated', () => {
      const req = {
        body: {
          id: 'user1',
        },
        params: {
          id: 'user1',
        },
      } as unknown as Request;
      const res = {} as unknown as Response;
      const next = jest.fn() as NextFunction;
      const interceptor = new Interceptor();
      test('should call next middleware function when user IDs match', async () => {
        await interceptor.authentication(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
  describe('When it is instantiated with ERROR', () => {
    describe('it should throw..', () => {
      const req = {
        body: {},
        params: {
          id: 'user1',
        },
      } as unknown as Request;
      const res = {} as unknown as Response;
      const next = jest.fn() as NextFunction;
      const interceptor = new Interceptor();
      test('should throw a CastError when user ID is undefined', async () => {
        await interceptor.authentication(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
  // Describe('When it is instantiated with Error', () => {
  //   test('should unsuccessfully extract and verify token', async () => {
  //     const req = {
  //       get: jest.fn().mockReturnValueOnce('token'),
  //       body: {},
  //     } as unknown as Request;
  //     const res = {} as unknown as Response;
  //     const next = jest.fn() as NextFunction;
  //     const interceptor = new Interceptor();

  //     (Auth.verifyAndGetPayload as jest.Mock).mockRejectedValueOnce(
  //       new Error('Token verification failed')
  //     );
  //     expect(interceptor.authorization(req, res, next)).rejects.toThrow(
  //       HttpError
  //     );
  //     expect(next).not.toHaveBeenCalled();
  //   });
  // });
});
