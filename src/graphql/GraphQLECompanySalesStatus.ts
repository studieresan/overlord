import {
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql'

export const CompanySalesStatus = new GraphQLObjectType({
  name : 'CompanySalesStatus',
  fields : {
    name:  { type: GraphQLString },
    id: { type: GraphQLString },
  },
})
