import rp from 'request-promise';
import DataLoader from 'dataloader';

import logger from '../../logger';

const { OPENWEATHER_API_KEY } = process.env;
const OPENWEATHERMAP_API_ROOT = 'https://api.openweathermap.org/data/2.5/';
const UNITS = 'imperial';

export class OpenWeatherMapConnector {
  constructor() {
    // Allow mocking request promise for tests
    this.url = OPENWEATHERMAP_API_ROOT;
    this.units = UNITS;
    this.key = OPENWEATHER_API_KEY;
    this.rp = rp;

    if (OpenWeatherMapConnector.mockRequestPromise) {
      this.rp = OpenWeatherMapConnector.mockRequestPromise;
    }

    this.loader = new DataLoader(this.fetch.bind(this), {
      batch: false
    });
  }

  fetch(urls) {
    const options = {
      json: true,
      resolveWithFullResponse: true
    };

    return Promise.all(
      urls.map(url => {
        logger.debug(`owmConnector Promise: ${url}`);
        return new Promise(resolve => {
          rp({
            url,
            ...options
          })
            .then(response => {
              const { body } = response;
              resolve(body);
            })
            .catch(err => {
              if (err.statusCode === 304) {
                logger.debug(`owmConnector 304 error: ${err}`);
                resolve(err);
              } else {
                logger.debug(`owmConnector other error: ${err}`);
                resolve('connector error');
              }
            });
        });
      })
    );
  }

  get(path) {
    const uri = `${this.url}${path}&units=${this.units}&appid=${this.key}`;
    logger.debug(`owmConnector url: ${uri}`);
    return this.loader.load(uri);
  }
}

export default OpenWeatherMapConnector;
