import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
  } from 'graphql'
import { UserType } from './GraphQLUser'
import { GraphQLDateTime } from './GraphQLDateTime'


export const SalesComment = new GraphQLObjectType({
  name: 'SalesComment',
  fields: () => ({
    id: { type: GraphQLID },
    text:  { type: GraphQLString },
    createdAt: {type: GraphQLDateTime },
    user: { type: UserType },
  }),
})

export const SalesCommentInput = new GraphQLInputObjectType({
  name: 'SalesCommentInput',
  fields: () => ({
    text:  { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(GraphQLID) },
    company: { type: new GraphQLNonNull(GraphQLID) },
  }),
})
