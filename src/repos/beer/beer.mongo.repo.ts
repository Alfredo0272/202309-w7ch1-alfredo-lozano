import { Repository } from '../repo';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { BeerModel } from './beer.mongo.model.js';
import { Beer } from '../../entities/beer.model.js';
import { UsersMongoRepo } from '../users/user.mongo.repo.js';
import mongoose from 'mongoose';

const debug = createDebug('W7E:beer:mongo:repo');

export class BeerMongoRepo implements Repository<Beer> {
  userRepo: UsersMongoRepo;

  constructor() {
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async search({
    key,
    value,
  }: {
    key: keyof Beer;
    value: any;
  }): Promise<Beer[]> {
    const result = await BeerModel.find({ [key]: value })
      .populate('author', {
        notes: 0,
      })
      .exec();

    return result;
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
    const userID = newItem.autor.id;
    await this.userRepo.getById(userID);
    const result: Beer = await BeerModel.create({
      ...newItem,
      autor: userID,
    });
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
    const result = await BeerModel.findByIdAndDelete(id)
      .populate('author', {
        beer: 0,
      })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const userID = result.autor.id;
    const user = await this.userRepo.getById(userID);
    user.probada = user.probada.filter((item) => {
      const itemID = item as unknown as mongoose.mongo.ObjectId;
      return itemID.toString() !== id;
    });
  }
}
