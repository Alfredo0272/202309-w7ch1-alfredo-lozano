import { NextFunction, Request, Response } from 'express';
import { BeerFileRepo } from '../repos/beer.file.repo.js';
import createDebug from 'debug';

const debug = createDebug('W7E:tasks:controller');

export class BeerController {
  repo: BeerFileRepo;
  constructor() {
    debug('Instantiated');
    this.repo = new BeerFileRepo();
  }

  async getAll(_req: Request, res: Response) {
    const result = await this.repo.getAll();
    res.json(result);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const beerId = parseInt(req.params.id, 10);
      const result = await this.repo.getById(beerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  search = (_req: Request, _res: Response) => {};

  async create(req: Request, res: Response) {
    const result = await this.repo.create(req.body);
    res.status(201);
    res.statusMessage = 'Created';
    res.json(result);
  }

  async update(req: Request, res: Response) {
    const beerId = parseInt(req.params.id, 10);
    const result = await this.repo.update(beerId, req.body);
    res.json(result);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const beerId = parseInt(req.params.id, 10);
      await this.repo.delete(beerId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
