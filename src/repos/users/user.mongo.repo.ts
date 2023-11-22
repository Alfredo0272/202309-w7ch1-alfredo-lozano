import { Repository } from '../repo.js';
import createDebug from 'debug';
import { LoginUser, User } from '../../entities/user.model.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W7E:trips:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('istantiated');
  }

  async login(loginUser: LoginUser): Promise<User[]> {
    const results = await UserModel.find({ email: loginUser.email }).exec();
    if (
      !results ||
      (await Auth.compare(loginUser.password, results[0].password))
    ) {
      throw new HttpError(401, 'Unauthorized');
    }

    return results;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  getById(_id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  update(_id: string, _updatedItem: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
