import {mergeResolvers} from 'merge-graphql-schemas';

import User from './User';
import Student from './Student';

const resolvers = [User, Student];

export default mergeResolvers(resolvers);
