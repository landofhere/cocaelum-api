import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { isString } from 'lodash';
import { createServer } from 'http';

// import { OpenWeatherMapConnector } from './data/openweathermap/connector';
// import { CurrentWeathers } from './data/openweathermap/models';

import schema from './data/schema';

// Arguments usually come from env vars
export function run({ PORT: portFromEnv = 3010 } = {}) {
  let port = portFromEnv;
  if (isString(portFromEnv)) {
    port = parseInt(portFromEnv, 10);
  }

  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/graphql', graphqlExpress({ schema }));

  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  const server = createServer(app);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API Server is now running on http://localhost:${port}.`);
  });

  return server;
}

export default run;
