import createDebug from 'debug';
import { Beer } from '../../entities/beer.model.js';
import { Controller } from '../controler.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W7E:beer:controller');

export class BeerController extends Controller<Beer> {
  constructor(protected repo: BeerMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new HttpError(406, 'Not acceptable', 'Invalid file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.beerImg = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
