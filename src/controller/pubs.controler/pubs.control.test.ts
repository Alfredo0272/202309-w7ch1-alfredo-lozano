import { PubsMongoRepo } from '../../repos/pubs/pubs.mongo.repo';
import { PubsController } from './pubs.controler';
import { Request, Response } from 'express';

describe('Given UsersController class', () => {
  let controller: PubsController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  beforeEach(() => {
    mockRequest = {
      body: { userId: 'userId' },
      params: { id: 'pubId' },
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });
  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        search: jest.fn().mockResolvedValue([{}]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        addBeer: jest.fn().mockResolvedValue({}),
        addPub: jest.fn().mockResolvedValue({}),
        removeBeer: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(undefined),
      } as unknown as PubsMongoRepo;

      controller = new PubsController(mockRepo);
    });

    test('Then getAll should ...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then getById should ...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then search should ...', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then create should ...', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then update should ...', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then delete should ...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('Then addBeer should ...', async () => {
      await controller.addBeer(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('Then addBeer should ...', async () => {
      await controller.removeBeer(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    describe('When we instantiate it WITH errors', () => {
      let mockError: Error;
      beforeEach(() => {
        mockError = new Error('Mock error');
        const mockRepo = {
          getAll: jest.fn().mockRejectedValue(mockError),
          getById: jest.fn().mockRejectedValue(mockError),
          search: jest.fn().mockRejectedValue(mockError),
          create: jest.fn().mockRejectedValue(mockError),
          update: jest.fn().mockRejectedValue(mockError),
          addPub: jest.fn().mockRejectedValue(mockError),
          addBeer: jest.fn().mockRejectedValue(mockError),
          delete: jest.fn().mockRejectedValue(mockError),
          removeBeer: jest.fn().mockRejectedValue(mockError),
          removePub: jest.fn().mockRejectedValue(mockError),
        } as unknown as PubsMongoRepo;

        controller = new PubsController(mockRepo);
      });

      test('Then getAll should ...', async () => {
        await controller.getAll(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });

      test('Then getById should ...', async () => {
        await controller.getById(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });

      test('Then search should ...', async () => {
        await controller.search(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });

      test('Then create should ...', async () => {
        await controller.create(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });

      test('Then update should ...', async () => {
        await controller.update(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });

      test('Then delete should ...', async () => {
        await controller.delete(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });
      test('then addBeer should..', async () => {
        await controller.addBeer(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });
      test('then addBeer should..', async () => {
        await controller.removeBeer(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });
    });
  });
});
