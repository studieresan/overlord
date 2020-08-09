import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
  } from 'graphql'
import { UserType } from './GraphQLUser'
import { Company } from './GraphQLCompany'
import { GraphQLDateTime } from './GraphQLDateTime'

export const SalesComment = new GraphQLObjectType({
  name : 'SalesComment',
  fields : {
    text:  { type: GraphQLString },
    id: { type: GraphQLString },
    company: { type: Company },
    user: { type: UserType },
    createdAt: {type: GraphQLDateTime },
    edited: { type: GraphQLBoolean},
    studsYear: {type: GraphQLInt},
  },
})
