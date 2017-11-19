import { GraphQLCV } from './GraphQLCV'
import {
  CVActions,
  CVActionsImpl,
} from './../controllers'
import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql'
import { MemberType } from './../models'

const cvCtrl: CVActions = new CVActionsImpl()

const MutableUserFields = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  position: { type: GraphQLString },
  phone: { type: GraphQLString },
  allergies: { type: GraphQLString },
  master: { type: GraphQLString },
}

export const GraphQLMemberType = new GraphQLEnumType({
  name : 'MemberType',
  values: {
    'studs_member': { value: MemberType.StudsMember },
    'company_member': { value: MemberType.CompanyMember },
  },
})

export const GraphQLUser = new GraphQLObjectType({
  name : 'User',
  fields : {
    email:  { type: GraphQLString },
    memberType:  { type: GraphQLMemberType },
    picture:  { type: GraphQLString },
    cv: {
      type: GraphQLCV,
      resolve({ id }, b, { req }) {
        return req.isAuthenticated()
          ? cvCtrl.getCV(id)
          : {}
      },
    },
    ...MutableUserFields,
  },
})

// This type represents the  fields that a user can change about themselves
export const GraphQLUserInput = new GraphQLInputObjectType({
  name : 'UserInput',
  fields : MutableUserFields,
})
