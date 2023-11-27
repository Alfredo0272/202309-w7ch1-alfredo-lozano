import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo.js';
import { UsersController } from '../controller/user.controler/user.contoler.js';

const debug = createDebug('W7E:user:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);

usersRouter.get('/search', controller.search.bind(controller));
usersRouter.post('/register', controller.create.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
