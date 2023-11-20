import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
const debug = createDebug('W7E:error:middleware');

debug('Starting');
export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug('Middleware Errors');
  res.status((error as HttpError).status);
  res.statusMessage = (error as HttpError).statusMessage;
  res.json({});
  debug((error as HttpError).message);
};
