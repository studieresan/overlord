import {
  UserProfileType,
  UserProfileInputType,
} from './GraphQLUserProfile'
import {
  GraphQLCV,
  GraphQLCVInput,
} from './GraphQLCV'
import {
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'
import {
  CVActions,
  CVActionsImpl,
} from './../controllers'

const cvCtrl: CVActions = new CVActionsImpl()

export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    profile: { type: UserProfileType },
    cv: {
      type: GraphQLCV,
      resolve(user, b, { req }) {
        return cvCtrl.getCV(user.id)
      },
    },
  },
})

export const UserInputType = new GraphQLInputObjectType({
  name : 'UserInput',
  fields : {
    profile: { type: UserProfileInputType },
    cv: { type: GraphQLCVInput },
  },
})

