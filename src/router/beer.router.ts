import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerController } from '../controller/beer.controler/beer.controler.js';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';
import { Interceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/files.interceptor.js';

const debug = createDebug('W7E:beer:router');

export const beerRouter = createRouter();
debug('Starting');

const repo = new BeerMongoRepo();
const controller = new BeerController(repo);
const interceptor = new Interceptor();
const fileInterceptor = new FileInterceptor();

beerRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
beerRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  controller.getById.bind(controller)
);
beerRouter.get(
  '/search',
  interceptor.authorization.bind(interceptor),
  controller.search.bind(controller)
);
beerRouter.post(
  '/add',
  interceptor.authentication.bind(interceptor),
  interceptor.authorization.bind(interceptor),
  fileInterceptor.singleFileStore('avatar').bind(fileInterceptor),
  controller.create.bind(controller)
);
beerRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  fileInterceptor.singleFileStore('avatar').bind(fileInterceptor),
  controller.update.bind(controller)
);
beerRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.delete.bind(controller)
);
