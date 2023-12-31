import createDebug from 'debug';
import { Controller } from '../controler.js';
import { Pubs } from '../../entities/pubs.model.js';
import { PubsMongoRepo } from '../../repos/pubs/pubs.mongo.repo.js';
import { NextFunction, Request, Response } from 'express';

const debug = createDebug('W7E:pubs:controller');

export class PubsController extends Controller<Pubs> {
  constructor(protected repo: PubsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.addBeer(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.removeBeer(req.params.id, req.body.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
