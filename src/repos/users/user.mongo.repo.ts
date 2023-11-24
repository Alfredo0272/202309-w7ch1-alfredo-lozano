import { Repository } from '../repo.js';
import createDebug from 'debug';
import { LoginUser, User } from '../../entities/user.model.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W7E:Users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('istantiated');
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('author', {
        notes: 0,
      })
      .exec();

    return result;
  }

  async login(loginUser: LoginUser): Promise<User[]> {
    const results = await UserModel.find({ email: loginUser.email }).exec();
    if (
      !results ||
      !(await Auth.compare(loginUser.password, results[0].password))
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

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id);
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('User', { name: 1 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
