import {
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql'

export const CompanySalesStatus = new GraphQLObjectType({
  name : 'CompanySalesStatus',
  fields : {
    status:  { type: GraphQLString },
    id: { type: GraphQLString },
  },
})
