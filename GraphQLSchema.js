import {makeExecutableSchema} from 'graphql-tools';

import resolvers from './resolvers';
import typeDefs from './types';

const schema = new makeExecutableSchema({
    resolvers,
    typeDefs
});

export default schema;