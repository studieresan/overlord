import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
} from 'graphql'
import { UserType } from './GraphQLUser'
import { CompanyContact } from './GraphQLCompanyContact'
import { EventType } from './GraphQLEvent'

export const YearResponsible = new GraphQLObjectType({
  name: 'YearResponsible',
  fields: () => ({
    year: { type: GraphQLInt },
    user: { type: UserType },
  }),
})

export const Company = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    companyContacts: { type: new GraphQLList(CompanyContact) },
    responsibleUsers: { type: new GraphQLList(YearResponsible) },
    events: { type: new GraphQLList(EventType) },
  }),
})

export const CompanyInput = new GraphQLInputObjectType({
  name: 'CompanyInput',
  fields: () => ({
    responsibleUser: { type: GraphQLString },
    status: { type: GraphQLString },
    name: { type: GraphQLString },
    amount: { type: GraphQLInt },
  }),
})
