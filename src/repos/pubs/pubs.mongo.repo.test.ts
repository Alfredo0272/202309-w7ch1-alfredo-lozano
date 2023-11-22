import fs from 'fs/promises';
import { PubsMongoRepo } from './pubs.mongo.repo';
import { PubsModel } from './pubs.mongo.model';

jest.mock('fs/promises');

describe('Given PubsMongoRepo class', () => {
  let repo: PubsMongoRepo;

  beforeEach(() => {
    const mockData = '[{"name": "Test"}]';
    fs.readFile = jest.fn().mockResolvedValue(mockData);
    fs.writeFile = jest.fn();
    repo = new PubsMongoRepo();
  });

  test('should instantiate PubsMongoRepo without errors', () => {
    expect(repo).toBeInstanceOf(PubsMongoRepo);
  });

  test('should return a Pubs object when given a valid id', async () => {
    const mockId = '';
    const pubsWithMockId = {
      id: mockId,
      name: 'Mock Pubs',
      owner: 'mock pepe',
      direction: 'mock direction',
    };
    jest.spyOn(PubsModel, 'findById').mockResolvedValueOnce(pubsWithMockId);
    const result = await repo.getById(mockId);

    expect(result).toEqual(pubsWithMockId);
    expect(PubsModel.findById).toHaveBeenCalledWith(mockId);
  });
});
