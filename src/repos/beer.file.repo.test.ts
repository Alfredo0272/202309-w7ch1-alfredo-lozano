import { BeerFileRepo } from './beer.file.repo.js';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Given TasksFileRepo class', () => {
  describe('When we instantiate it', () => {
    const mockData = '[{"name": "Test"}]';
    fs.readFile = jest.fn().mockResolvedValue(mockData);
    fs.writeFile = jest.fn();
    const repo = new BeerFileRepo();

    test('Then getAll should ...', async () => {
      const result = await repo.getAll();
      expect(result).toStrictEqual(JSON.parse(mockData));
    });
  });
});
