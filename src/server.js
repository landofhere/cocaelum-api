import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { isString } from 'lodash';
import { createServer } from 'http';
import morgan from 'morgan';
import logger from './logger';

import { CurrentWeathers } from './data/openweathermap/models';
import { OpenWeatherMapConnector } from './data/openweathermap/connector';

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
  app.use(
    morgan('dev', {
      skip: (req, res) => res.statusCode < 400,
      stream: process.stderr
    })
  );
  app.use(
    morgan('dev', {
      skip: (req, res) => res.statusCode < 400,
      stream: process.stdout
    })
  );

  app.get('/', (req, res) => {
    logger.debug('Debug statement');
    logger.info('Info statement');
    res.send('Hello World!');
  });

  app.use(
    '/graphql',
    graphqlExpress(req => {
      const query = req.query.query || req.body.query;
      if (query && query.length > 2000) {
        // None of our app's queries are this long
        // Probably indicates someone trying to send an overly expensive query
        throw new Error('Query too large.');
      }

      const openWeatherMapConnector = new OpenWeatherMapConnector();

      return {
        schema,
        context: {
          CurrentWeathers: new CurrentWeathers({
            connector: openWeatherMapConnector
          })
        }
      };
    })
  );

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      query: `query getWeatherByCity($city: String!) {
  getWeatherByCity(city: $city) {
    name
    id
    dt
    main
    sys
    base
    cod
    weather
    owid
    coord
    clouds
    rain
    snow
    visibility
  }
}`,
      variables: { city: 'Angwin' }
    })
  );

  const server = createServer(app);

  server.listen(port, () => {
    logger.info(`API Server is now running on http://localhost:${port}.`);
  });

  return server;
}

export default run;
