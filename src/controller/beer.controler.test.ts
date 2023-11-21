import { Request, Response } from 'express';
import { BeerController } from './beer.controler'; // Asegúrate de usar el nombre correcto del archivo
import { BeerFileRepo } from '../repos/beer.file.repo.js';

describe('Given BeerController class', () => {
  describe('When we instantiate it', () => {
    let controller: BeerController;
    let mockRequest: Request;
    let mockResponse: Response;

    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
      } as unknown as BeerFileRepo;

      controller = new BeerController(mockRepo);
      mockRequest = {} as Request;
      mockResponse = {} as Response;
    });

    test('Then getAll should respond with the expected data', async () => {
      await controller.getAll(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });
  });
});

//
//       const controller = new BeerController();
//       const mockRequest: Request = {
//         body: {},
//       } as Request;
//       const mockResponse: Response = {
//         json: jest.fn(),
//       } as unknown as Response;
//
//     });

//     test('Then getById should...', async () => {
//       const mockRequest: Request = {
//         params: { id: '1' },
//       } as unknown as Request;
//       const mockResponse: Response = { json: jest.fn() } as unknown as Response;
//       const next = jest.fn();
//       const beerController = new BeerController();
//       beerController.repo.getById = jest
//         .fn()
//         .mockResolvedValue({ id: '1', name: 'Beer' });
//       await beerController.getById(mockRequest, mockResponse, next);
//       expect(beerController.repo.getById).toHaveBeenCalledWith('1');
//       expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', name: 'Beer' });
//     });

//     test('Then create should...', async () => {
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
