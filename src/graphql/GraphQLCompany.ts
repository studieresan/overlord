import {
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql'

export const Company = new GraphQLObjectType({
  name : 'Company',
  fields : {
    status:  { type: GraphQLString },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    responsibleUser: { type: GraphQLString },
  },
})
