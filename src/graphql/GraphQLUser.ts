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

function getCV(req: any, res: any, requestedUser: any) {
  return new Promise(resolve => {
    passport.authenticate('jwt', { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          resolve(undefined)
        }
        resolve(cvCtrl.getCV(requestedUser.id))
      }
    )(req, res, () => {})
  })
}

export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    id: { type: GraphQLString },
    profile: { type: UserProfileType },
    permissions: { type: new GraphQLList(GraphQLString) },
    cv: {
      type: CVType,
      async resolve(requestedUser, b, { req, res }) {
        return await getCV(req, res, requestedUser)
      },
    },
  },
})

