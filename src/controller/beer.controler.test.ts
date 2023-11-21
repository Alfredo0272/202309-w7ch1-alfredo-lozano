import { Request, Response } from 'express';
import { BeerController } from './beer.controler'; // Asegúrate de usar el nombre correcto del archivo
import { BeerFileRepo } from '../repos/beer.file.repo.js';

describe('Given BeerController class', () => {
  let controller: BeerController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    } as Request;
    mockResponse = { json: jest.fn() } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue([{}]),
      } as unknown as BeerFileRepo;

      controller = new BeerController(mockRepo);
    });
    test('then get all should respond with expected data', async () => {
      await controller.getAll(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('then getById should should respond with expected data', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('then create should return a new data', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });
  });
  describe('When we instantiate it WITH errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Mock Error');
      const mockRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
      } as unknown as BeerFileRepo;
      controller = new BeerController(mockRepo);
    });
    test('Then getByID should respond with the expected data', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});

//     Test('Then create should...', async () => {
//       const beerController = new BeerController();
//       const req = {
//         body: {},
//       } as unknown as Request;
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         statusMessage: '',
//         json: jest.fn(),
//       } as unknown as Response;
//       const next = jest.fn();
//       await beerController.create(req, res, next);
//       expect(res.json).toHaveBeenCalled(/* expected result */);
//     });

//     test('The should update a beer...', async () => {
//       const beerController = new BeerController();
//       const req = {
//         params: { id: '1' },
//         body: { name: 'Updated Beer' },
//       } as unknown as Request;
//       const res = {
//         json: jest.fn(),
//       } as unknown as Response;
//       beerController.repo.update = jest
//         .fn()
//         .mockResolvedValue({ id: '1', name: 'Updated Beer' });
//       const next = jest.fn();
//       await beerController.update(req, res, next);
//       expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Updated Beer' });
//     });
//     // Test('Then delete should...', async () => {
//     //   const beerController = new BeerController();
//     //   const req = { params: { id: 1 } } as unknown as Request;
//     //   const res = {
//     //     status: jest.fn().mockReturnThis(),
//     //     json: jest.fn(),
//     //     statusMessage: '',
//     //   } as unknown as Response;
//     //   const next = jest.fn();
//     //   await beerController.delete(req, res, next);
//     //   expect(res.status).toHaveBeenCalledWith(204);
//     //   expect(res.json).toHaveBeenCalledWith({});
//     //   expect(next).not.toHaveBeenCalled();
//     // });
//   });
// });
