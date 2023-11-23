import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { Auth } from '../services/auth.js';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';

const debug = createDebug(
  'W7E:Alt Rebel scum this is the interceptor:middleware'
);

export class Interceptor {
  constructor() {
    debug('instatiate');
  }

  authorization(req: Request, _res: Response, next: NextFunction) {
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

  async authenticationBeer(req: Request, res: Response, next: NextFunction) {
    try {
      // Eres el usuario
      const userID = req.body.id;

      // Quieres actuar sobre la creacion de birra
      const beerId = req.params.id;
      const repoBeer = new BeerMongoRepo();
      const beer = await repoBeer.getById(beerId);
      if (beer !== userID) throw new HttpError(401, 'Not authorirez');
      next();
    } catch (error) {
      next(error);
    }
  }
}
