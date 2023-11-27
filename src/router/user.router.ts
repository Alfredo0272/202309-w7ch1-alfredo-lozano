import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo.js';
import { UsersController } from '../controller/user.controler/user.contoler.js';
import { FileInterceptor } from '../middleware/files.interceptor.js';
import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:user:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const fileInterceptor = new FileInterceptor();
const interceptor = new Interceptor();

usersRouter.post(
  '/register',
  fileInterceptor.singleFileStore('avatar').bind(fileInterceptor),
  controller.create.bind(controller)
);
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  controller.addBeer.bind(controller)
);
usersRouter.patch(
  '/addPub/:id',
  interceptor.authorization.bind(interceptor),
  controller.addPub.bind(controller)
);
usersRouter.patch(
  '/delBeer/:id',
  interceptor.authorization.bind(interceptor),
  controller.removePub.bind(controller)
);
usersRouter.patch(
  '/delPub/:id',
  interceptor.authorization.bind(interceptor),
  controller.removeBeer.bind(controller)
);
