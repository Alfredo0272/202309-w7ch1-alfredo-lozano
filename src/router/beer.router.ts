import { Router as createRouter } from 'express';
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from '../controller/beer.controler.js';

export const beerRouter = createRouter();

beerRouter.get('/', getAll);
beerRouter.get('/:id', getById);
beerRouter.post('/', create);
beerRouter.patch('/:id', update);
beerRouter.delete('/:id', remove);
