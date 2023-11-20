import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { beerRouter } from './router/beer.router.js';
import createDebug from 'debug';
const debug = createDebug('W7E:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/beer', beerRouter);
