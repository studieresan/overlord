import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql'
import * as models from './../models'

const MutableProfileFields = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  position: { type: GraphQLString },
  phone: { type: GraphQLString },
  allergies: { type: GraphQLString },
  master: { type: GraphQLString },
}

export const MemberType = new GraphQLEnumType({
  name : 'MemberType',
  values: {
    'studs_member': { value: models.MemberType.StudsMember },
    'company_member': { value: models.MemberType.CompanyMember },
  },
})

export const UserProfileType = new GraphQLObjectType({
  name : 'UserProfile',
  fields : {
    email:  { type: GraphQLString },
    memberType:  { type: MemberType },
    picture:  { type: GraphQLString },
    ...MutableProfileFields,
  },
})

// This type represents the fields that a user can change about themselves
export const UserProfileInputType = new GraphQLInputObjectType({
  name : 'UserProfileInput',
  fields : MutableProfileFields,
})
