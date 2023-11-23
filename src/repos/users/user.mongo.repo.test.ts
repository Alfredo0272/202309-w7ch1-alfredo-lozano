import fs from 'fs/promises';
import { UsersMongoRepo } from './user.mongo.repo.js';
import { UserModel } from './users.mongo.model.js';

jest.mock('fs/promises');

describe('Given PubsMongoRepo class', () => {
  let repo: UsersMongoRepo;

  beforeEach(() => {
    const mockData = '[{"name": "Test"}]';
    fs.readFile = jest.fn().mockResolvedValue(mockData);
    fs.writeFile = jest.fn();
    repo = new UsersMongoRepo();
  });

  test('should instantiate PubsMongoRepo without errors', () => {
    expect(repo).toBeInstanceOf(UsersMongoRepo);
  });

  test('should return a Pubs object when given a valid id', async () => {
    const mockId = '';
    const usersWithMockId = {
      id: mockId,
      name: 'Mock Pubs',
      password: 'mock pepe',
      email: 'mock direction',
    };
    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(usersWithMockId);
    const result = await repo.getById(mockId);

    expect(result).toEqual(usersWithMockId);
    expect(UserModel.findById).toHaveBeenCalledWith(mockId);
  });
});
