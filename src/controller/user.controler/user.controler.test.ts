import { Request, Response } from 'express';
import { UsersController } from './user.contoler.js';
import { User } from '../../entities/user.model.js';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';

describe('Given UsersController class', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  let mockRepo: UsersMongoRepo;
  let mockResult: User;

  beforeEach(() => {
    mockResult = {
      password: '',
      email: '',
      name: '',
    } as User;

    mockRepo = {
      login: jest.fn().mockResolvedValue(mockResult),
      getAll: jest.fn().mockResolvedValue([{}]),
      getById: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({ id: 'newId', name: 'New User' }),
      delete: jest.fn(),
    } as unknown as UsersMongoRepo;

    mockRequest = {
      body: {},
      params: {},
    } as Request;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      statusMessage: '',
      json: jest.fn(),
    } as unknown as Response;

    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    test('should return a successful response', async () => {
      const controller = new UsersController(mockRepo);
      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.statusMessage).toBe('Accepted');
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });
    test('should return a successful response for create', async () => {
      const controller = new UsersController(mockRepo);
      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toBe('Created');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'newId',
        name: 'New User',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    test('getById should respond with expected data', async () => {
      const controller = new UsersController(mockRepo);
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('get all should respond with expected data', async () => {
      const controller = new UsersController(mockRepo);
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });
  });
});
