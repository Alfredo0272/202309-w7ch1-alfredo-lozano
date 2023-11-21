import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { PubsMongoRepo } from '../repos/pubs.mongo.repo.js';
import { PubsController } from '../controller/pubs.controler.js';

const debug = createDebug('W7E:beer:router');

export const pubsRouter = createRouter();
debug('Starting');

const repo = new PubsMongoRepo();
const controller = new PubsController(repo);

pubsRouter.get('/', controller.getAll.bind(controller));
pubsRouter.get('/:id', controller.getById.bind(controller));
pubsRouter.post('/', controller.create.bind(controller));
pubsRouter.patch('/:id', controller.update.bind(controller));
pubsRouter.patch('addUser/:id', controller.update.bind(controller));
pubsRouter.patch('removeUser/:id', controller.update.bind(controller));
pubsRouter.delete('/:id', controller.delete.bind(controller));
