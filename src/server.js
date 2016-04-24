import 'babel-core/polyfill';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
const server = global.server = express();
const port = process.env.PORT || 5500;
server.set('port', port);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

import routes from './router/routes';
import tasks from './background/background';
import './background/dbConnection';

const modelsPath = __dirname + '/models/';

fs.readdirSync(modelsPath)
  .filter(file => file.indexOf('.js') >= 0)
  .forEach(file => {
    require(`./models/${file}`);
  });


routes(server);

tasks.run();

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
