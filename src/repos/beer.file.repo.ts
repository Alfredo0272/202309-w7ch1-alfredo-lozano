import { Repository } from './repo';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import fs from 'fs/promises';
import { Beer } from '../entities/beer.model.js';
import { randomInt } from 'crypto';

const debug = createDebug('W7E:beer:file:repo');

export class BeerFileRepo implements Repository<Beer> {
  file: string;
  beers: Beer[];
  constructor() {
    debug('Instantiated');
    this.file = './data/data.json';
    this.beers = [];
    this.loadData();
  }

  private async loadData() {
    const data = await fs.readFile(this.file, { encoding: 'utf-8' });
    this.beers = JSON.parse(data);
  }

  async getAll(): Promise<Beer[]> {
    return this.beers;
  }

  async getById(id: number): Promise<Beer> {
    const result = this.beers.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  search({ _key, _value }: { _key: string; _value: unknown }): Promise<Beer[]> {
    throw new Error('Method not implemented.');
  }

  async create(newItem: Omit<Beer, 'id'>): Promise<Beer> {
    const result: Beer = { ...newItem, id: randomInt(0, 1000) };
    const newBeer = [...this.beers, result];
    await this.save(newBeer as Beer[]);
    return result;
  }

  async update(id: number, updatedItem: Partial<Beer>): Promise<Beer> {
    let result = this.beers.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    result = { ...result, ...updatedItem } as Beer;
    const newBeer = this.beers.map((item) => (item.id === id ? result : item));
    await this.save(newBeer as Beer[]);
    return result;
  }

  async delete(id: number): Promise<void> {
    const newBeer = this.beers.filter((item) => item.id !== id);
    if (newBeer.length === this.beers.length) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await this.save(newBeer);
  }

  private async save(newBeers: Beer[]) {
    await fs.writeFile(this.file, JSON.stringify(newBeers), {
      encoding: 'utf-8',
    });
    this.beers = newBeers;
  }
}
