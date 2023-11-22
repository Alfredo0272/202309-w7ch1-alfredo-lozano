import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerController } from '../controller/beer.controler/beer.controler.js';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';

const debug = createDebug('W7E:beer:router');

export const beerRouter = createRouter();
debug('Starting');

const repo = new BeerMongoRepo();
const controller = new BeerController(repo);

beerRouter.get('/', controller.getAll.bind(controller));
beerRouter.get('/:id', controller.getById.bind(controller));
beerRouter.post('/add', controller.create.bind(controller));
beerRouter.patch('/:id', controller.update.bind(controller));
beerRouter.patch('addUser/:id', controller.update.bind(controller));
beerRouter.patch('removeUser/:id', controller.update.bind(controller));
beerRouter.delete('/:id', controller.delete.bind(controller));
