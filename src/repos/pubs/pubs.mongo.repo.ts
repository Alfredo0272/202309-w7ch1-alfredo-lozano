import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { PubsModel } from './pubs.mongo.model.js';
import { Pubs } from '../../entities/pubs.model.js';

const debug = createDebug('W7E:Pubs:mongo:repo');

export class PubsMongoRepo implements Repository<Pubs> {
  constructor() {
    debug('instantiated');
  }

  async search({
    key,
    value,
  }: {
    key: keyof Pubs;
    value: any;
  }): Promise<Pubs[]> {
    const result = await PubsModel.find({ [key]: value })
      .populate('author', {
        notes: 0,
      })
      .exec();

    return result;
  }

  async getAll(): Promise<Pubs[]> {
    const result = await PubsModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<Pubs> {
    const result = await PubsModel.findById(id);
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Get By Id not Possible');
    }

    return result;
  }

  async create(newItem: Omit<Pubs, 'id'>): Promise<Pubs> {
    const result: Pubs = await PubsModel.create(newItem);
    return result;
  }

  async update(id: string, updatedItem: Partial<Pubs>): Promise<Pubs> {
    const result = await PubsModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('User', { name: 1 })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not Possible');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await PubsModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not Possible');
    }
  }
}
