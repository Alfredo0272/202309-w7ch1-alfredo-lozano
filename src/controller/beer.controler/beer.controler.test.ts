import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { HttpError } from '../../types/http.error';
import { BeerController } from './beer.controler';
import { Request, Response } from 'express';

describe('Given UsersController class', () => {
  describe('When we instantiate it without errors', () => {
    test('should create a new beer with valid input data and image file', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      const mockParentCreate = jest.fn();
      const mockRepo = {
        create: mockParentCreate,
      } as unknown as BeerMongoRepo;
      const controller = new BeerController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.beerImg).toBe(mockImageData);
      expect(mockParentCreate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe('when we initiate WITH errors', () => {
    test('should return a 500 HttpError when an error occurs during beer creation', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      const mockParentCreate = jest
        .fn()
        .mockRejectedValue(new Error('Beer creation error'));
      const mockRepo = {
        create: mockParentCreate,
      } as unknown as BeerMongoRepo;
      const controller = new BeerController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.beerImg).toBe(mockImageData);
      expect(mockParentCreate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(500, 'Internal Server Error', 'Beer creation error')
      );
    });
    test('should call next with an instance of HttpError if no image file is provided', async () => {
      const mockRequest = {
        file: undefined,
        body: {},
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      const mockParentCreate = jest.fn();
      const mockRepo = {
        create: mockParentCreate,
      } as unknown as BeerMongoRepo;
      const controller = new BeerController(mockRepo);
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
      expect(mockNext.mock.calls[0][0].status).toBe(406);
      expect(mockNext.mock.calls[0][0].statusMessage).toBe('Not acceptable');
      expect(mockNext.mock.calls[0][0].message).toBe('Invalid file');
    });
  });
});
