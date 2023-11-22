import { Repository } from '../repo';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { BeerModel } from './beer.mongo.model.js';
import { Beer } from '../../entities/beer.model';
import { UsersMongoRepo } from '../users/user.mongo.repo';

const debug = createDebug('W7E:beer:mongo:repo');

export class BeerMongoRepo implements Repository<Beer> {
  userRepo: UsersMongoRepo;

  constructor() {
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Beer[]> {
    const result = await BeerModel.find().populate('autor', { name: 1 }).exec();
    return result;
  }

  async getById(id: string): Promise<Beer> {
    const result = await BeerModel.findById(id);
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<Beer, 'id'>): Promise<Beer> {
    const user = await this.userRepo.getById(newItem.autor);
    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    newItem.autor = user.id;
    const result: Beer = await BeerModel.create(newItem);
    return result;
  }

  async update(id: string, updatedItem: Partial<Beer>): Promise<Beer> {
    const result = await BeerModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('User', { name: 1 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await BeerModel.findByIdAndDelete(id);
    if (!result) throw new HttpError(404, 'Not Found', 'Delete not possible');
  }
}
