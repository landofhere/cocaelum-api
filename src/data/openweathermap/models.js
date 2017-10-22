export default class CurrentWeather {
  constructor({ connector }) {
    this.connector = connector;
  }

  getWeatherByCity(city) {
    return this.connector.get(`weather?q=${city}`);
  }

  getWeatherByID(id) {
    return this.connector.get(`weather?id=${id}`);
  }

  getWeatherByLongLat(lat, lon) {
    return this.connector.get(`weather?lat=${lat}&lon=${lon} `);
  }

  getWeatherByZip(zip, country = 'us') {
    return this.connector.get(`weather?zip=${zip},${country} `);
  }
}
