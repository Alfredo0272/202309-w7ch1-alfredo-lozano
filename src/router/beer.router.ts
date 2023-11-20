import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerController } from '../controller/beer.controler.js';

const debug = createDebug('W7E:beer:router');

export const beerRouter = createRouter();
debug('Starting');
const controller = new BeerController();

beerRouter.get('/', controller.getAll.bind(controller));
beerRouter.get('/search', controller.search.bind(controller));
beerRouter.get('/:id', controller.getById.bind(controller));
beerRouter.post('/', controller.create.bind(controller));
beerRouter.patch('/:id', controller.update.bind(controller));
beerRouter.patch('addUser/:id', controller.update.bind(controller));
beerRouter.patch('removeUser/:id', controller.update.bind(controller));
beerRouter.delete('/:id', controller.delete.bind(controller));
