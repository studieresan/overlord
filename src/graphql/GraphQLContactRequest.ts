import {
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql'
import { GraphQLDateTime } from './GraphQLDateTime'

export const ContactRequest = new GraphQLObjectType({
  name: 'ContactRequest',
  fields: () => ({
    email:  { type: GraphQLString },
    id: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
  }),
})
