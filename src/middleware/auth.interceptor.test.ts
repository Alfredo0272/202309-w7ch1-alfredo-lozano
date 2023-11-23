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
  });

  // Describe('When it is instantiated with Error', () => {
  //   const req = {
  //     get: jest.fn().mockReturnValueOnce('token'),
  //     body: {},
  //   } as unknown as Request;
  //   const res = {} as unknown as Response;
  //   const next = jest.fn() as NextFunction;
  //   const interceptor = new Interceptor();
  //   test('should unsuccessfully extract and verify token', () => {
  //     expect(() => interceptor.authorization(req, res, next)).toThrow(
  //       HttpError
  //     );
  //     expect(next).not.toHaveBeenCalled();
  //   });
  // });
});
