import rp from 'request-promise';
import DataLoader from 'dataloader';
import OPENWEATHER_API_KEY from './openWeatherMapKey';
// Keys are GitHub API URLs, values are { etag, result } objects
const eTagCache = {};

const OPENWEATHERMAP_API_ROOT = 'https://api.openweathermap.org/data/2.5/';
const UNITS = 'imperial';

export class OpenWeatherMapConnector {
  constructor() {
    // Allow mocking request promise for tests
    this.rp = rp;
    if (OpenWeatherMapConnector.mockRequestPromise) {
      this.rp = OpenWeatherMapConnector.mockRequestPromise;
    }

    this.loader = new DataLoader(this.fetch.bind(this), {
      batch: false
    });
  }
  fetch(urls) {
    console.log(`fetch:$urls`); // eslint-disable-line no-console
    const options = {
      json: true,
      resolveWithFullResponse: true
    };

    return Promise.all(
      urls.map(url => {
        const cachedRes = eTagCache[url];

        if (cachedRes && cachedRes.eTag) {
          options.headers['If-None-Match'] = cachedRes.eTag;
        }
        return new Promise(resolve => {
          this.rp({
            uri: url,
            ...options
          })
            .then(({ responseBody, headers }) => {
              const body = responseBody;
              eTagCache[url] = {
                result: body,
                eTag: headers.etag
              };
              resolve(body);
            })
            .catch(err => {
              if (err.statusCode === 304) {
                resolve(cachedRes.result);
              } else {
                // We need better error handling on the client, for now
                // just return null if GitHub can't find something
                resolve(null);
              }
            });
        });
      })
    );
  }

  get(path) {
    // eslint-disable-next-line no-console
    console.log(`${OPENWEATHERMAP_API_ROOT}
    ${path}
    &units=${UNITS}
    &appid=${this.accessToken}`);
    return this.loader.load(
      `${OPENWEATHERMAP_API_ROOT}
      ${path}
      &units=${UNITS}
      &appid=${OPENWEATHER_API_KEY}`
    );
  }
}

export default OpenWeatherMapConnector;
