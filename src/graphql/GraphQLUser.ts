import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql'
import { MemberType } from './../models'

const MutableUserFields = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  phone: { type: GraphQLString },
  picture: { type: GraphQLString },
  allergies: { type: GraphQLString },
  master: { type: GraphQLString },
}
export const GraphQLUser = new GraphQLObjectType({
  name : 'User',
  fields : {
    email:  { type: GraphQLString },
    ...MutableUserFields,
  },
})

// This type represents the  fields that a user can change about themselves
export const GraphQLUserInput = new GraphQLInputObjectType({
  name : 'UserInput',
  fields : MutableUserFields,
})

export const GraphQLMemberType = new GraphQLEnumType({
  name : 'MemberType',
  values: {
    'studs_member': { value: MemberType.StudsMember },
    'company_member': { value: MemberType.CompanyMember },
  },
})
