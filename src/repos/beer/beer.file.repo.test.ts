import { Beer } from '../../entities/beer.model.js';
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
    test('should return a Beer object when given a valid id that exists in the list of beers', async () => {
      const repo = new BeerFileRepo();
      const mockId = '1';
      const beerWithMockId = {
        id: mockId,
        name: 'Mock Beer',
        brewer: 'Mock Brewer',
        style: 'Mock Style',
        alcohol: 'Mock Alcohol',
      };
      repo.beers.push(beerWithMockId);
      const result = await repo.getById(mockId);
      expect(result).toEqual(expect.objectContaining({ id: mockId }));
    });
    test('should add a new beer and return it', async () => {
      const mockData = '[]';
      const mockName = 'Beer nº2';
      fs.readFile = jest.fn().mockResolvedValue(mockData);
      const repo = new BeerFileRepo();

      const newBeer = { name: mockName } as Omit<Beer, 'id'>;
      const result = await repo.create(newBeer);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', mockName);
      const updatedData = await repo.getAll();
      expect(updatedData).toHaveLength(1);
      expect(updatedData[0]).toEqual(result);
    });
    test('Then update should modify an existing film and return it', async () => {
      const id = '1';
      const updatedItem = { name: 'Updated Beer' };
      const expectedResult = {
        id: '1',
        name: 'Updated Beer',
        brewer: 'Brewer',
        style: 'Style',
        alcohol: '5%',
      };
      const beerFileRepo = new BeerFileRepo();
      beerFileRepo.beers = [
        {
          id: '1',
          name: 'Beer',
          brewer: 'Brewer',
          style: 'Style',
          alcohol: '5%',
        },
      ];
      const result = await beerFileRepo.update(id, updatedItem);
      expect(result).toEqual(expectedResult);
    });
  });
});
