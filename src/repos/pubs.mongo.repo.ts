import fs from 'fs/promises';
import { Pubs } from '../entities/pubs.model.js';
import { Repository } from './repo';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { PubsModel } from './pubs.mongo.model.js';

const debug = createDebug('W7E:trips:mongo:repo');

export class PubsMongoRepo implements Repository<Pubs> {
  file: string;
  pubs: Pubs[];
  constructor() {
    debug('instantiated');
    this.file = './data/pubs.json';
    this.pubs = [];
    this.loadData();
  }

  private async loadData() {
    const data = await fs.readFile(this.file, { encoding: 'utf-8' });
    this.pubs = JSON.parse(data);
  }

  async getAll(): Promise<Pubs[]> {
    const result = await PubsModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<Pubs> {
    const result = await PubsModel.findById(id);
    if (!result)
      throw new HttpError(404, 'Not Found', 'Get By Id not Possible');
    return result;
  }

  async create(newItem: Omit<Pubs, 'id'>): Promise<Pubs> {
    const result: Pubs = await PubsModel.create(newItem);
    return result;
  }

  async update(id: string, updatedItem: Partial<Pubs>): Promise<Pubs> {
    const result = await PubsModel.findByIdAndUpdate(id, updatedItem);
    if (!result) throw new HttpError(404, 'Not Found', 'Update not Possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await PubsModel.findByIdAndDelete(id);
    if (!result) throw new HttpError(404, 'Not Found', 'Delete not Possible');
  }
}
