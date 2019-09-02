import {
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql'
import { UserType } from './GraphQLUser';
import { Company } from './GraphQLCompany';

export const SalesComment = new GraphQLObjectType({
  name : 'SalesComment',
  fields : {
    text:  { type: GraphQLString },
    id: { type: GraphQLString },
    company: { type: Company },
    user: { type: UserType },
  },
})
