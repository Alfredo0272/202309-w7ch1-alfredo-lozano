import createDebug from 'debug';
import { UserLogin, User } from '../../entities/user.model.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';
import { Repository } from '../repo.js';

const debug = createDebug('W7E:Users:mongo:repo');
export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async login(loginUser: UserLogin): Promise<User> {
    const result = await UserModel.findOne({
      email: loginUser.email,
    }).exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findById',
      });
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate(
        'probadas',
        {
          beer: 0,
        },
        'visitado',
        {
          pubs: 0,
        }
      )
      .exec();

    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });
    return data;
  }

  async visitado(_id: string, _body: any) {
    throw new Error('Method not implemented.');
  }

  async probada(_id: string, _body: any) {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Fail to delete',
      });
  }
}
