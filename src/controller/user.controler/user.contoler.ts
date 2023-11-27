import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';
import { User } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';
import { Controller } from '../controler.js';

const debug = createDebug('W7E:users:controller');

export class UsersController extends Controller<User> {
  constructor(protected repo: UsersMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async visitado(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.visitado(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async probada(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.visitado(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
