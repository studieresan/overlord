import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
  } from 'graphql'

const MutableCompanyContactFields = {
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  phoneNumber: { type: GraphQLString },
  comment: { type: GraphQLString },
}

export const CompanyContact = new GraphQLObjectType({
  name : 'CompanyContact',
  fields : {
    id: { type: GraphQLString },
    ...MutableCompanyContactFields,
  },
})

export const CompanyContactInput = new GraphQLInputObjectType({
  name : 'CompanyContactInput',
  fields : MutableCompanyContactFields,
})
