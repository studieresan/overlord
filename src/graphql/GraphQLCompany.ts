import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'
import { CompanyContact, CompanyContactInput } from './GraphQLCompanyContact'

const CompanySaleCommentFields = {
  content: { type: GraphQLString },
  author: { type: GraphQLString },
}

export const CompanySaleComment = new GraphQLObjectType({
  name: 'CompanySaleComment',
  fields: () => ({
    ...CompanySaleCommentFields,
  }),
})

export const MutableCompanySaleComment = new GraphQLInputObjectType({
  name: 'MutableCompanySaleComment',
  fields: () => ({
    ...CompanySaleCommentFields,
  }),
})

const CompanyStudsYearFields = {
  studsYear: { type: GraphQLInt },
  responsibleUser: { type: GraphQLString },
  statusDescription: { type: GraphQLString },
  statusPriority: { type: GraphQLInt },
  amount: { type: GraphQLInt },
}

export const CompanyStudsYear = new GraphQLObjectType({
    name: 'CompanyStudsYear',
    fields: () => ({
      ...CompanyStudsYearFields,
      salesComments: { type: new GraphQLList(CompanySaleComment) },
    }),
})

export const MutableCompanyStudsYear = new GraphQLInputObjectType({
  name: 'MutableCompanyStudsYear',
  fields: () => ({
    // Require studsyear as we math the status against it
    ...CompanyStudsYearFields,
    salesComments: { type: new GraphQLList(MutableCompanySaleComment) },
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
    years: { type: new GraphQLList(CompanyStudsYear) },
    companyContacts: { type: new GraphQLList(CompanyContact) },
  }),
})

export const CompanyInput = new GraphQLInputObjectType({
  name: 'CompanyInput',
  fields: () => ({
    ...MutableCompanyFields,
  }),
})
