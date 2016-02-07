import 'babel-core/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
// import multer from 'multer';
import routes from './router/routes';
const server = global.server = express();
// const upload = multer();
const port = process.env.PORT || 5500;
server.set('port', port);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const dbPath = 'mongodb://localhost/streetsmart-development';

import mongoose from 'mongoose';
const db = mongoose.createConnection(dbPath);

db.on('error', () => {
  throw new Error(`unable to connect to database at ${dbPath}`);
});

routes(server);

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
