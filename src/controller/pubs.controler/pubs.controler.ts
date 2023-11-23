import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repository } from '../../repos/repo.js';
import { Pubs } from '../../entities/pubs.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W7E:pubs:controller');

export class PubsController {
  // eslint-disable-next-line no-unused-vars
  constructor(private repo: Repository<Pubs>) {
    debug('Instantiated');
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.search({
        key: Object.entries(req.query)[0][0] as keyof Pubs,
        value: Object.entries(req.query)[0][1],
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.create(req.body.id);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');

      if (!tokenHeader?.startsWith('bearer'))
        throw new HttpError(401, ' Unauthoriced');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.id = tokenPayload.id;
      const result = await this.repo.update(req.params.id, req.body.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
