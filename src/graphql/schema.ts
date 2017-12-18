import {
  UserActions,
  UserActionsImpl,
  CVActions,
  CVActionsImpl,
  FeedbackActions,
  FeedbackActionsImpl,
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
  FeedbackType
} from './GraphQLFeedback'
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { createDefaultFeedback } from '../models'

const userCtrl: UserActions = new UserActionsImpl()
const cvCtrl: CVActions = new CVActionsImpl()
const feedbackCtrl: FeedbackActions = new FeedbackActionsImpl()

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
            : {}
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
            : {}
        },
      },
      cv: {
        type: GraphQLCV,
        resolve(a, b, { req }) {
          return req.isAuthenticated()
            ? cvCtrl.getCV(req.user.id)
            : {}
        },
      },
      feedback: {
        description: 'Get feedback for a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req }) {
          return req.isAuthenticated()
            ? feedbackCtrl.getFeedback(companyId)
            : {}
        },
      },
      allFeedback: {
        description: 'Get all feedback as a list',
        type: new GraphQLList(FeedbackType),
        resolve(a, b, { req }) {
          return req.isAuthenticated()
            ? feedbackCtrl.getAllFeedback()
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
        resolve(a, { fields }, { req }) {
          return req.isAuthenticated()
            ? userCtrl.setUser(req.user.id, fields)
            : {}
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
            : {}
        },
      },
      createFeedback: {
        description: 'Create new feedback tied to a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req }) {
          return req.isAuthenticated()
            ? feedbackCtrl.createFeedback(companyId)
            : {}
        },
      },
    },
  }),
})

export default schema
