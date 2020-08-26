import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
  } from 'graphql'
import { UserType } from './GraphQLUser'
import { CompanySalesStatus } from './GraphQLECompanySalesStatus'

export const CompanyYear = new GraphQLObjectType({
  name: 'CompanyYear',
  fields : {
    year: { type: GraphQLInt},
    responsibleUser: { type: UserType },
    amount: { type: GraphQLInt },
    status:  { type: CompanySalesStatus },
  },
})

export const Company = new GraphQLObjectType({
  name : 'Company',
  fields : {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    years: {type: new GraphQLList(CompanyYear)},
  },
})


export const CompanyInput = new GraphQLInputObjectType({
  name : 'CompanyInput',
  fields : {
    responsibleUser: { type: GraphQLString },
    status: { type: GraphQLString },
    name: {type: GraphQLString },
    amount: {type: GraphQLInt },
  },
})
