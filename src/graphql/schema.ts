import {
  UserActions,
  UserActionsImpl,
  CVActions,
  CVActionsImpl,
  FeedbackActions,
  FeedbackActionsImpl,
} from './../controllers'
import {
  UserProfileType,
  UserProfileInputType,
  MemberType,
} from './GraphQLUserProfile'
import {
  GraphQLCV,
  GraphQLCVInput,
} from './GraphQLCV'
import {
  FeedbackType,
  FeedbackInputType,
} from './GraphQLFeedback'
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'

const userCtrl: UserActions = new UserActionsImpl()
const cvCtrl: CVActions = new CVActionsImpl()
const feedbackCtrl: FeedbackActions = new FeedbackActionsImpl()

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        // Return information about the user, assuming they are logged in
        type: UserProfileType,
        resolve(a, b, { req }) {
          return req.isAuthenticated()
            ? userCtrl.getUserProfile(req.user.id)
            : {}
        },
      },
      users: {
        // Return all the users of a given type
        type: new GraphQLList(UserProfileType),
        args: {
          memberType: { type: new GraphQLNonNull(MemberType) },
        },
        resolve(a, { memberType }, { req }) {
          return req.isAuthenticated()
            ? userCtrl.getUserProfiles(memberType)
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
        type: UserProfileType,
        args: {
          fields: { type: UserProfileInputType },
        },
        resolve(a, { fields }, { req }) {
          return req.isAuthenticated()
            ? userCtrl.setUserProfile(req.user.id, fields)
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
      updateFeedback: {
        description: 'Update the feedback tied to a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: FeedbackInputType },
        },
        resolve(a, { companyId, fields }, { req }) {
          return req.isAuthenticated()
            ? feedbackCtrl.updateFeedback(companyId, fields)
            : {}
        },
      },
      removeFeedback: {
        description: 'Remove the feedback tied to a company ID, '
          + 'returns true if feedback was successfully removed',
        type: GraphQLBoolean,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req }) {
          return req.isAuthenticated()
            ? feedbackCtrl.removeFeedback(companyId)
            : {}
        },
      },
    },
  }),
})

export default schema
