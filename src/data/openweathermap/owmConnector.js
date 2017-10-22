import rp from 'request-promise';

import OPENWEATHER_API_KEY from './openWeatherMapKey';

const OPENWEATHERMAP_API_ROOT = 'https://api.openweathermap.org/data/2.5/';
const UNITS = 'imperial';

export function currentWeathers(city) {
  const uri = `${OPENWEATHERMAP_API_ROOT}weather?q=${city}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
  // console.log(uri); // eslint-disable-line no-console

  const options = {
    json: true,
    resolveWithFullResponse: true
  };

  return new Promise(resolve => {
    rp({
      uri,
      ...options
    })
      .then(response => {
        const { body } = response;
        resolve(body);
      })
      .catch(err => {
        if (err.statusCode === 304) {
          resolve(err);
        } else {
          // We need better error handling on the client, for now
          // just return null if GitHub can't find something
          resolve(null);
        }
      });
  });
}

export default currentWeathers;
