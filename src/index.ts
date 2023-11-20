import { createServer } from 'http';
import { app } from './app.js';
import createDebug from 'debug';

const debug = createDebug('W7E:index');

const PORT = process.env.PORT || 1969;
debug('Starting server');

const server = createServer(app);

server.listen(PORT);

server.on('listening', () => {
  console.log('Listening on port', PORT);
});
