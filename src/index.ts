import { createServer } from 'http';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './services/db.conect.js';

const debug = createDebug('W7E:index');
const PORT = process.env.PORT || 1969;
const server = createServer(app);
debug('Starting server');

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('conected to DB', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('listening', () => {
  console.log('Listening on port', PORT);
});

server.on('error', (error) => {
  debug(`Error ${error.message}`);
});
