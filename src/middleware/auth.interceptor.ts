import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { Auth } from '../services/auth.js';

const debug = createDebug(
  'W7E:Alt Rebel scum this is the interceptor:middleware'
);

export class Interceptor {
  constructor() {
    debug('instatiate');
  }

  authoritation(req: Request, _res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');

      if (!tokenHeader?.startsWith('bearer'))
        throw new HttpError(401, ' Unauthoriced');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.id = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  authentication(req: Request, res: Response, next: NextFunction) {}
}
