import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { PubsMongoRepo } from '../repos/pubs/pubs.mongo.repo.js';
import { PubsController } from '../controller/pubs.controler/pubs.controler.js';
import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:pubs:router');

export const pubsRouter = createRouter();
debug('Starting');

const repo = new PubsMongoRepo();
const controller = new PubsController(repo);
const interceptor = new Interceptor();

pubsRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
pubsRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  controller.getById.bind(controller)
);
pubsRouter.get(
  '/search',
  interceptor.authorization.bind(interceptor),
  controller.search.bind(controller)
);
pubsRouter.post(
  '/add',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.create.bind(controller)
);
pubsRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.update.bind(controller)
);
pubsRouter.patch(
  'addpubs/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.update.bind(controller)
);
pubsRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authentication.bind(interceptor),
  controller.delete.bind(controller)
);
