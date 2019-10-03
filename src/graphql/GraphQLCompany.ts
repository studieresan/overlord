import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
  } from 'graphql'
import { UserType } from './GraphQLUser'
import { CompanySalesStatus } from './GraphQLECompanySalesStatus'

export const Company = new GraphQLObjectType({
  name : 'Company',
  fields : {
    status:  { type: CompanySalesStatus },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    responsibleUser: { type: UserType },
  },
})

export const CompanyInput = new GraphQLInputObjectType({
  name : 'CompanyInput',
  fields : {
    responsibleUser: { type: GraphQLString },
    status: { type: GraphQLString },
    name: {type: GraphQLString },
  },
})
