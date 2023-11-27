import createDebug from 'debug';
import { Beer } from '../../entities/beer.model.js';
import { Controller } from '../controler.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';

const debug = createDebug('W7E:beer:controller');

export class BeerController extends Controller<Beer> {
  constructor(protected repo: BeerMongoRepo) {
    super(repo);
    debug('Instantiated');
  }
}
