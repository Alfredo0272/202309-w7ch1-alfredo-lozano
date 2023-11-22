import { Request, Response } from 'express';
import { BeerController } from './beer.controler';
import { Repository } from '../../repos/repo';
import { Beer } from '../../entities/beer.model';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';

describe('Given BeerController class', () => {
  let controller: BeerController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  let mockRepo: Repository<Beer>;
  let mockError: Error;

  beforeEach(() => {
    mockRequest = { body: {}, params: {} } as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      statusMessage: '',
    } as unknown as Response;
    mockNext = jest.fn();
    mockError = new Error('Mock Error');
  });

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({ id: 'newId', name: 'New Beer' }),
        delete: jest.fn(),
      } as unknown as BeerMongoRepo;

      controller = new BeerController(mockRepo);
    });

    test('get all should respond with expected data', async () => {
      await controller.getAll(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('getById should respond with expected data', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('create should return new data', async () => {
      const mockBeer = { id: 'newId', name: 'New Beer' };
      mockRequest.body = mockBeer;

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith(mockBeer);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toBe('Created');
      expect(mockResponse.json).toHaveBeenCalledWith(mockBeer);
    });

    test('should throw an error if body is not provided', async () => {
      const mockRequest: Request = {
        params: { id: 'validId' },
        body: {},
      } as unknown as Request;
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('delete should...', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        statusMessage: '',
      } as unknown as Response;
      const next = jest.fn();
      await controller.delete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({});
      expect(next).not.toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('When we instantiate it WITH errors', () => {
    beforeEach(() => {
      mockRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
      } as unknown as BeerMongoRepo;
      controller = new BeerController(mockRepo);
    });

    test('getById should respond with the expected ERROR data', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('create should respond with the expected ERROR data', async () => {
      mockRequest.body = mockError;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});