import {
  UserProfileType,
} from './GraphQLUserProfile'
import {
  CVType,
} from './GraphQLCV'
import {
  GraphQLObjectType,
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
      type: CVType,
      resolve(user, b, { req }) {
        return req.isAuthenticated()
          ? cvCtrl.getCV(user.id)
          : undefined
      },
    },
  },
})

