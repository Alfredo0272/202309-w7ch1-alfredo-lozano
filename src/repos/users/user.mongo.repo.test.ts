import { UsersMongoRepo } from './user.mongo.repo.js';
import { UserModel } from './users.mongo.model.js';
jest.mock('./users.mongo.model');

describe('Given UserMongoRepo class', () => {
  let repo: UsersMongoRepo;
  describe('When we isntantiate it without errors', () => {
    const exec = jest.fn().mockReturnValue('Test');
    beforeEach(() => {
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.create = jest.fn();
      repo = new UsersMongoRepo();
    });
    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
    test('Then it should create', async () => {
      const newItem = {
        username: 'testUser',
        password: 'testPassword',
      };
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue(newItem);
      UsersMongoRepo.prototype.update = jest.fn();
    });
    test('ahould search', async () => {
      const result = await repo.search({ key: 'name', value: true });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('name');
    });
  });
  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockRejectedValue(new Error('Test'));
    beforeEach(() => {
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      repo = new UsersMongoRepo();
    });

    test('Then it should execute getById', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });
  });
});
