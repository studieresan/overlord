import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
  // GraphQLInt,
} from 'graphql'
import {
  CVType,
} from './GraphQLCV'
import * as models from './../models'
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

const MutableProfileFields = {
  email: { type: GraphQLString },
  phone: { type: GraphQLString },
  linkedIn: { type: GraphQLString },
  github: { type: GraphQLString },
  master: { type: GraphQLString },
  allergies: { type: GraphQLString },
}

export const UserRole = new GraphQLEnumType({
  name : 'UserRole',
  values: {
    'project_manager': { value: models.UserRole.ProjectManager },
    'it_group': { value: models.UserRole.ItGroup },
    'sales_group': { value: models.UserRole.SalesGroup },
    'finance_group': { value: models.UserRole.FinanceGroup },
    'event_group': { value: models.UserRole.EventGroup },
    'travel_group': { value: models.UserRole.TravelGroup },
    'info_group': { value: models.UserRole.InfoGroup },
  },
})

export const UserProfileType = new GraphQLObjectType({
  name : 'UserProfile',
  fields : {
    role: { type: GraphQLString },
    ...MutableProfileFields,
    picture: { type: GraphQLString },
    cv: {
      type: CVType,
      async resolve(requestedUser, b, { req, res }) {
        return await getCV(req, res, requestedUser)
      },
    },
  },
})

// This type represents the fields that a user can change about themselves
export const UserProfileInputType = new GraphQLInputObjectType({
  name : 'UserProfileInput',
  fields : MutableProfileFields,
})
