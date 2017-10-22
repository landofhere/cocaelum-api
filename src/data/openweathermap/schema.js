import { currentWeathers } from './owmConnector';

export const schema = [
  `
# A repository object from the GitHub API. This uses the exact field names returned by the
# GitHub API for simplicity, even though the convention for GraphQL is usually to camel case.
type CurrentWeathers {
  name: String
  dt: Float
  main: JSON
  sys: JSON
  wind: JSON
  base: String
  owid: Int
  coord: JSON
  clouds: JSON
  rain: JSON
  snow: JSON
  weather: [JSON]
  visibility: Int
  cod: Int
  id: Int
}

type Query {
  # A feed of repository submissions
  getWeatherByCity(
    city: String!,
  ): CurrentWeathers

  getWeatherByID(
    id: String!,
  ): CurrentWeathers
}
`
];

export const resolvers = {
  Query: {
    getWeatherByCity(root, { city }) {
      return currentWeathers(city);
    },
    getWeatherByID(root, { id }) {
      return currentWeathers(id);
    }
  }
};
