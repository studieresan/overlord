import { UserActions } from './../controllers/UserActions'
import { UserActionsImpl } from './../controllers/UserActionsImpl'
import {
  CVActions,
  CVActionsImpl,
} from './../controllers'
import {
  GraphQLUser,
  GraphQLUserInput,
  GraphQLMemberType,
} from './GraphQLUser'
import {
  GraphQLCV,
  GraphQLCVInput,
} from './GraphQLCV'
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

const userCtrl: UserActions = new UserActionsImpl()
const cvCtrl: CVActions = new CVActionsImpl()
const UNAUTHORIZED_ERROR = Promise.reject('not authorized')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        // Return information about the user, assuming they are logged in
        type: GraphQLUser,
        resolve(a, b, { req }) {
          return req.isAuthenticated()
            ? userCtrl.getUser(req.user.id)
            : UNAUTHORIZED_ERROR
        },
      },
      users: {
        // Return all the users of a given type
        type: new GraphQLList(GraphQLUser),
        args: {
          memberType: { type: new GraphQLNonNull(GraphQLMemberType) },
        },
        resolve(a, { memberType }, { req }) {
          return req.isAuthenticated()
            ? userCtrl.getUsers(memberType)
            : UNAUTHORIZED_ERROR
        },
      },
      cv: {
        type: GraphQLCV,
        resolve(a, b, { req }) {
          return req.isAuthenticated()
            ? cvCtrl.getCV(req.user.id)
            : UNAUTHORIZED_ERROR
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      setUser: {
        type: GraphQLUser,
        args: {
          fields: { type: GraphQLUserInput },
        },
        resolve(a, { fields }, { req }) {
          return req.isAuthenticated()
            ? userCtrl.setUser(req.user.id, fields)
            : UNAUTHORIZED_ERROR
        },
      },
      setCv: {
        type: GraphQLCV,
        args: {
          fields: { type: GraphQLCVInput },
        },
        resolve(a, { fields }, { req }) {
          return req.isAuthenticated()
            ? cvCtrl.setCV(req.user.id, fields)
            : UNAUTHORIZED_ERROR
        },
      },
    },
  }),
})

export default schema
