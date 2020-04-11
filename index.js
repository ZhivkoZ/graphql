import {mergeTypes} from 'merge-graphql-schemas';
import User from './User';
import Student from './Student';

const typeDefs = [User, Student];

export default mergeTypes(typeDefs, {all: true});