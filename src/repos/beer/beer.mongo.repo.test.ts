import { BeerMongoRepo } from './beer.mongo.repo.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Given TasksFileRepo class', () => {
  let repo: BeerMongoRepo;
  describe('When we instantiate it', () => {
    const mockData = '[{"name": "Test"}]';
    fs.readFile = jest.fn().mockResolvedValue(mockData);
    fs.writeFile = jest.fn();
    test('Then getAll should ...', async () => {
      const result = await repo.getAll();
      expect(result).toStrictEqual(JSON.parse(mockData));
    });
  });
});
