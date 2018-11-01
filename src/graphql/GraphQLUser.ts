import {
  UserProfileType,
} from './GraphQLUserProfile'
import {
  CVType,
} from './GraphQLCV'
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql'
import {
  CVActions,
  CVActionsImpl,
} from './../controllers'
import * as passport from 'passport'

const cvCtrl: CVActions = new CVActionsImpl()

export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    id: { type: GraphQLString },
    profile: { type: UserProfileType },
    permissions: { type: new GraphQLList(GraphQLString) },
    cv: {
      type: CVType,
      resolve(requestedUser, b, { req, res }) {
        passport.authenticate('jwt', { session: false },
          (err: any, user: any, info: any) => {
            if (err || !user) {
              return undefined
            }
            return cvCtrl.getCV(requestedUser.id)
          }
        )(req, res, () => {})
      },
    },
  },
})

