import {
  UserActions,
  UserActionsImpl,
  CVActions,
  CVActionsImpl,
  EventActions,
  EventActionsImpl,
  FeedbackActions,
  FeedbackActionsImpl,
  EventFormActions,
  EventFormActionsImpl,
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
  EventFormType,
  PreEventFormType,
  PreEventFormInputType,
  PostEventFormType,
  PostEventFormInputType,
} from './GraphQLEventForms'
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'
import * as passportConfig from '../config/passport'
import * as descriptions from './schemaDescriptions'

const userCtrl: UserActions = new UserActionsImpl()
const cvCtrl: CVActions = new CVActionsImpl()
const eventCtrl: EventActions = new EventActionsImpl()
const feedbackCtrl: FeedbackActions = new FeedbackActionsImpl()
const eventFormCtrl: EventFormActions = new EventFormActionsImpl()

function requireAuth<A>(req: any, res: any, body: () => A) {
  return new Promise(resolve => {
    passportConfig.authenticate(req, res, () => {
      resolve(body())
    })
  })
}

const schema = new GraphQLSchema({
  types: [PreEventFormType, PostEventFormType, EventFormType],
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        description: 'Get the currently logged in user',
        type: UserType,
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res, () => req.user)
        },
      },
      users: {
        description: 'Get a list of users of the given member type',
        type: new GraphQLList(UserType),
        args: {
          memberType: { type: new GraphQLNonNull(MemberType) },
        },
        async resolve(a, { memberType }, { req, res }) {
          return await userCtrl.getUsers(req, res, memberType)
        },
      },
      feedback: {
        description: 'Get feedback for a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(a, { companyId }, { req, res }) {
          return await requireAuth(req, res,
            () => feedbackCtrl.getFeedback(companyId))
        },
      },
      allEvents: {
        description: 'Get all events as a list',
        type: new GraphQLList(EventType),
        async resolve(a, b, { req, res }) {
          return await eventCtrl.getEvents(req, res)
        },
      },
      oldEvents: {
        description: 'Get all old events as a list',
        type: new GraphQLList(EventType),
        async resolve() {
          return await eventCtrl.getOldEvents()
        },
      },
      allFeedback: {
        description: 'Get all feedback as a list',
        type: new GraphQLList(FeedbackType),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
            () => feedbackCtrl.getAllFeedback())
        },
      },
      eventForms: {
        description: descriptions.eventFormsQuery,
        type: new GraphQLList(new GraphQLNonNull(EventFormType)),
        args: {
          userId: { type: GraphQLString },
          eventId: { type: GraphQLString },
        },
        async resolve(root, { userId, eventId }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.getEventForms(req.user, userId, eventId))
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
        async resolve(a, { fields }, { req, res }) {
          return await requireAuth(req, res,
            () => userCtrl.updateUserProfile(req.user.id, fields))
        },
      },
      updateCV: {
        description: 'Update the CV of the currently logged in user',
        type: CVType,
        args: {
          fields: { type: CVInputType },
        },
        async resolve(a, { fields }, { req, res }) {
          return await requireAuth(req, res,
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
        async resolve(a, { companyName, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventCtrl.createEvent(req.user, companyName, fields))
        },
      },
      updateEvent: {
        description: 'Update the event with given event ID',
        type: EventType,
        args: {
          eventId: { type: GraphQLString },
          fields: { type: EventInputType },
        },
        async resolve(a, { eventId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventCtrl.updateEvent(req.user, eventId, fields))
        },
      },
      removeEvent: {
        description: 'Remove an event with the given ID',
        type: GraphQLBoolean,
        args: {
          eventId: { type: GraphQLString },
        },
        async resolve(a, { eventId }, { req, res }) {
          return await requireAuth(req, res,
            () => eventCtrl.removeEvent(eventId))
        },
      },
      createFeedback: {
        description: 'Create new feedback tied to a company ID',
        type: FeedbackType,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(a, { companyId }, { req, res }) {
          return await requireAuth(req, res,
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
        async resolve(a, { companyId, fields }, { req, res }) {
          return await requireAuth(req, res,
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
        async resolve(a, { companyId }, { req, res }) {
          return await requireAuth(req, res,
            () => feedbackCtrl.removeFeedback(companyId))
        },
      },
      createPreEventForm: {
        description: descriptions.createPreEventFormMutation,
        type: PreEventFormType,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: PreEventFormInputType },
        },
        async resolve(root, { eventId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.createPreEventForm(
              req.user.id,
              eventId,
              fields
            )
          )
        },
      },
      createPostEventForm: {
        description: descriptions.createPostEventFormMutation,
        type: PostEventFormType,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: PostEventFormInputType },
        },
        async resolve(root, { eventId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.createPostEventForm(
              req.user.id,
              eventId,
              fields
            )
          )
        },
      },
      updatePreEventForm: {
        description: descriptions.updatePreEventFormMutation,
        type: PreEventFormType,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: PreEventFormInputType },
        },
        async resolve(root, { eventId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.updatePreEventForm(
              req.user.id,
              eventId,
              fields
            )
          )
        },
      },
      updatePostEventForm: {
        description: descriptions.updatePostEventFormMutation,
        type: PostEventFormType,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
          fields: { type: PostEventFormInputType },
        },
        async resolve(root, { eventId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.updatePostEventForm(
              req.user.id,
              eventId,
              fields
            )
          )
        },
      },
      deletePreEventForm: {
        description: descriptions.deletePreEventFormMutation,
        type: GraphQLString,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(root, { eventId }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.deletePreEventForm(
              req.user.id,
              eventId
            )
          )
        },
      },
      deletePostEventForm: {
        description: descriptions.deletePostEventFormMutation,
        type: GraphQLString,
        args: {
          eventId: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(root, { eventId }, { req, res }) {
          return await requireAuth(req, res,
            () => eventFormCtrl.deletePostEventForm(
              req.user.id,
              eventId
            )
          )
        },
      },
    },
  }),
})

export default schema
