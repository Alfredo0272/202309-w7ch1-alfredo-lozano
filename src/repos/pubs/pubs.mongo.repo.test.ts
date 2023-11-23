import { PubsModel } from './pubs.mongo.model.js';
import { PubsMongoRepo } from './pubs.mongo.repo';
jest.mock('./pubs.mongo.model.js');

describe('When...', () => {
  // eslint-disable-next-line no-unused-vars
  let repo: PubsMongoRepo;
  describe('When we instantiate it without errors', () => {
    let repo: PubsMongoRepo;
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      PubsModel.find = jest.fn().mockReturnValue({
        exec,
      });
      PubsModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      repo = new PubsMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(result).toBe('Test');
    });
  });
});
