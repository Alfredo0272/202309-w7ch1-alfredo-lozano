import createDebug from 'debug';
import { Controller } from '../controler.js';
import { Pubs } from '../../entities/pubs.model.js';
import { PubsMongoRepo } from '../../repos/pubs/pubs.mongo.repo.js';

const debug = createDebug('W7E:pubs:controller');

export class PubsController extends Controller<Pubs> {
  constructor(protected repo: PubsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }
}
