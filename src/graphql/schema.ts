import {
  UserActions,
  UserActionsImpl,
  CVActions,
  CVActionsImpl,
  EventActions,
  EventActionsImpl,
  FeedbackActions,
  FeedbackActionsImpl,
} from './../controllers'
import {
  UserType
} from './GraphQLUser'
import {
  UserProfileType,
  UserProfileInputType,
  MemberType,
} from './GraphQLUserProfile'
import {
  CVType,
  CVInputType,
} from './GraphQLCV'
import {
  EventType,
  EventInputType
} from './GraphQLEvent'
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
const eventCtrl: EventActions = new EventActionsImpl()
const feedbackCtrl: FeedbackActions = new FeedbackActionsImpl()

const UNAUTHORIZED_ERROR = 'not authorized'

function requireAuth<A>(req: any, res: any, body: () => A) {
  if (req.isAuthenticated())  {
    return body()
  } else {
    res.status(403)
    return Promise.reject(UNAUTHORIZED_ERROR)
  }
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        description: 'Get the currently logged in user',
        type: UserType,
        resolve(a, b, { req, res }) {
          return requireAuth(req, res, () => req.user)
        },
      },
      users: {
        description: 'Get a list of users of the given member type',
        type: new GraphQLList(UserType),
        args: {
          memberType: { type: new GraphQLNonNull(MemberType) },
        },
        resolve(a, { memberType }, { req }) {
          return userCtrl.getUsers(req.user, memberType)
        },
      },
      feedback: {
        description: 'Get feedback for a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req, res }) {
          return requireAuth(req, res,
            () => feedbackCtrl.getFeedback(companyId))
        },
      },
      allEvents: {
        description: 'Get all events as a list',
        type: new GraphQLList(EventType),
        resolve(a, b, { req }) {
          return eventCtrl.getEvents(req.user)
        },
      },
      allFeedback: {
        description: 'Get all feedback as a list',
        type: new GraphQLList(FeedbackType),
        resolve(a, b, { req, res }) {
          return requireAuth(req, res, () => feedbackCtrl.getAllFeedback())
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      updateProfile: {
        description: 'Update the profile of the currently logged in user',
        type: UserProfileType,
        args: {
          fields: { type: UserProfileInputType },
        },
        resolve(a, { fields }, { req, res }) {
          return requireAuth(req, res,
            () => userCtrl.updateUserProfile(req.user.id, fields))
        },
      },
      updateCV: {
        description: 'Update the CV of the currently logged in user',
        type: CVType,
        args: {
          fields: { type: CVInputType },
        },
        resolve(a, { fields }, { req, res }) {
          return requireAuth(req, res,
            () => cvCtrl.updateCV(req.user.id, fields))
        },
      },
      createEvent: {
        description: 'Create new event tied to company name',
        type: EventType,
        args: {
          companyName: { type: GraphQLString },
          fields: { type: EventInputType },
        },
        resolve(a, { companyName, fields }, { req, res }) {
          return requireAuth(req, res,
            () => eventCtrl.createEvent(companyName, fields))
        },
      },
      updateEvent: {
        description: 'Update the event with given event ID',
        type: EventType,
        args: {
          eventId: { type: GraphQLString },
          fields: { type: EventInputType },
        },
        resolve(a, { eventId, fields }, { req, res }) {
          return requireAuth(req, res,
            () => eventCtrl.updateEvent(eventId, fields))
        },
      },
      deleteEvent: {
        description: 'Delete an event with the given ID',
        type: EventType,
        args: {
          eventId: { type: GraphQLString },
        },
        resolve(a, { eventId }, { req, res }) {
          return requireAuth(req, res,
            () => eventCtrl.deleteEvent(eventId))
        },
      },
      createFeedback: {
        description: 'Create new feedback tied to a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req, res }) {
          return requireAuth(req, res,
            () => feedbackCtrl.createFeedback(companyId))
        },
      },
      updateFeedback: {
        description: 'Update the feedback tied to a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: FeedbackInputType },
        },
        resolve(a, { companyId, fields }, { req, res }) {
          return requireAuth(req, res,
            () => feedbackCtrl.updateFeedback(companyId, fields))
        },
      },
      removeFeedback: {
        description: 'Remove the feedback tied to a company ID, '
          + 'returns true if feedback was successfully removed',
        type: GraphQLBoolean,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(a, { companyId }, { req, res }) {
          return requireAuth(req, res,
            () => feedbackCtrl.removeFeedback(companyId))
        },
      },
    },
  }),
})

export default schema
