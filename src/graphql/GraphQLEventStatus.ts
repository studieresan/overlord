import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
  } from 'graphql'
import { UserType } from './GraphQLUser'
import { Company } from './GraphQLCompany'
import { GraphQLDateTime } from './GraphQLDateTime'

export const SalesComment = new GraphQLObjectType({
  name: 'SalesComment',
  fields: () => ({
    text:  { type: GraphQLString },
    createdAt: {type: GraphQLDateTime },
    edited: { type: GraphQLBoolean},
    id: { type: GraphQLString },
    company: { type: Company },
    user: { type: UserType },
  }),
})

export const StatusType = new GraphQLObjectType({
  name: 'StatusType',
  fields: () => ({
    name:  { type: GraphQLString },
    priority: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    salesComments: { type: new GraphQLList(SalesComment) },
  }),
})