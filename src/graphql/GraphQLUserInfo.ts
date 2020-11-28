import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLList,
} from 'graphql'
import {
    CVInputType,
  CVType,
} from './GraphQLCV'
import * as models from '../models'
import {
  CVActions,
  CVActionsImpl,
} from '../controllers'
// import * as passport from 'passport'

const cvCtrl: CVActions = new CVActionsImpl()

// function getCV(req: any, res: any, requestedUser: any) {
//   return new Promise(resolve => {
//     passport.authenticate('jwt', { session: false },
//       (err: any, user: any, info: any) => {
//         if (err || !user) {
//           resolve(undefined)
//         }
//         resolve(cvCtrl.getCV(requestedUser.id))
//       }
//     )(req, res, () => {})
//   })
// }

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


const MutableInfoFields = {
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    linkedIn: { type: GraphQLString },
    github: { type: GraphQLString },
    master: { type: GraphQLString },
    allergies: { type: GraphQLString },
    picture: { type: GraphQLString },
}

export const UserInfoType = new GraphQLObjectType({
  name : 'UserInfo',
  fields : {
    role: { type: GraphQLString },
    ...MutableInfoFields,
    // Should not be moved to MutableInfoFields is because CVType is not an InputObjectType
    cv: {
        type: CVType,
        async resolve(a, b, { req, res }) {
            return await cvCtrl.getCV(req.user.id)
        },
    },
    permissions: { type: new GraphQLList(GraphQLString) },
  },
})

// This type represents the fields that a user can change about themselves
export const UserInfoInputType = new GraphQLInputObjectType({
  name : 'UserInfoInput',
  fields : {
      ...MutableInfoFields,
      cv: {
          type: CVInputType,
      },
  },
})
