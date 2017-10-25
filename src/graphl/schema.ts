import { UserActions, } from './../controllers/UserActions'
import { UserActionsImpl, } from './../controllers/UserActionsImpl'
import {
  GraphQLUser,
  GraphQLUserInput,
  GraphQLMemberType,
} from './GraphQLUser'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql'

const userCtrl: UserActions = new UserActionsImpl()

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        // Return information about the user, assuming they are logged in
        type: GraphQLUser,
        resolve(a, b, { req }) {
          return req.isAuthenticated
            ? userCtrl.getUser(req.user.id)
            : {}
        },
      },
      users: {
        // Return all the users of a given type
        type: new GraphQLList(GraphQLUser),
        args: {
          memberType: { type: GraphQLMemberType },
        },
        resolve(a, { memberType }, { req }) {
          return req.isAuthenticated
            ? userCtrl.getUsers(memberType)
            : {}
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
        resolve(a, { fields }, { req, }) {
          return req.isAuthenticated
            ? userCtrl.updateUser(req.user.id, fields)
            : {}
        },
      },
    },
  }),
})

export default schema
