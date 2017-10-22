import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

import {
  schema as openWeatherMapSchema,
  resolvers as openWeatherMapResolvers
} from './openweathermap/schema';

const rootSchema = [
  `
scalar JSON

schema {
  query: Query
}
`
];

const rootResolvers = {
  JSON: GraphQLJSON
};

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const typeDefs = [...rootSchema, ...openWeatherMapSchema];
const resolvers = merge(rootResolvers, openWeatherMapResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default executableSchema;
