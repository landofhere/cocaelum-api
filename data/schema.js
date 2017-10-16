import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import mocks from './mocks';

const typeDefs = `
scalar JSON

type GetWeatherByCityPayload {
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
}

type Query {
  getWeatherByCity(city: String!): GetWeatherByCityPayload
}
`;

const resolveFunctions = {
  JSON: GraphQLJSON
};

const schema = makeExecutableSchema({ typeDefs, resolvers: resolveFunctions });

addMockFunctionsToSchema({ schema, mocks });

export default schema;
