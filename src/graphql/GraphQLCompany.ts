import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
} from 'graphql'
import { CompanyContact } from './GraphQLCompanyContact'
import { SalesComment, SalesCommentInput } from './GraphQLSalesComment'
import { UserType } from './GraphQLUser'

const CompanyStudsYearFields = {
  studsYear: { type: GraphQLInt },
  statusDescription: { type: GraphQLString },
  statusPriority: { type: GraphQLInt },
  amount: { type: GraphQLInt },
}

export const CompanyStudsYear = new GraphQLObjectType({
    name: 'CompanyStudsYear',
    fields: () => ({
      ...CompanyStudsYearFields,
      salesComments: { type: new GraphQLList(SalesComment) },
      responsibleUser: { type: UserType },
    }),
})

export const MutableCompanyStudsYear = new GraphQLInputObjectType({
  name: 'MutableCompanyStudsYear',
  fields: () => ({
    // Require studsyear as we math the status against it
    ...CompanyStudsYearFields,
    salesComments: { type: new GraphQLList(SalesCommentInput) },
  }),
})

const MutableCompanyFields = {
  name: { type: GraphQLString },
}

export const Company = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLID },
    ...MutableCompanyFields,
    companyContacts: { type: new GraphQLList(CompanyContact) },
    statuses: { type: new GraphQLList(CompanyStudsYear) },
  }),
})

export const CompanyInput = new GraphQLInputObjectType({
  name: 'CompanyInput',
  fields: () => ({
    ...MutableCompanyFields,
  }),
})
