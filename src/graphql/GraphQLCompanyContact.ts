import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInputObjectType,
} from 'graphql'

const MutableCompanyContactFields = {
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  phone: { type: GraphQLString },
  comment: { type: GraphQLString },
}

export const CompanyContact = new GraphQLObjectType({
  name: 'CompanyContact',
  fields: () => ({
    id: { type: GraphQLID },
    ...MutableCompanyContactFields,
  }),
})

export const CompanyContactInput = new GraphQLInputObjectType({
  name: 'CompanyContactInput',
  fields: {
    ...MutableCompanyContactFields,
  },
})
