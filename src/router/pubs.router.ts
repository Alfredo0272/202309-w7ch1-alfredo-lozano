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

pubsRouter.get('/', controller.getAll.bind(controller));
pubsRouter.get('/:id', controller.getById.bind(controller));
pubsRouter.get('/search', controller.search.bind(controller));
pubsRouter.post(
  '/add',
  interceptor.authentication.bind(interceptor),
  controller.create.bind(controller)
);
pubsRouter.patch('/:id', controller.update.bind(controller));
pubsRouter.patch('addpubs/:id', controller.update.bind(controller));
pubsRouter.patch('removeUser/:id', controller.update.bind(controller));
pubsRouter.delete('/:id', controller.delete.bind(controller));
