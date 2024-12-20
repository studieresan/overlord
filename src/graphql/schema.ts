import {
  UserActions,
  UserActionsImpl,
  EventActions,
  EventActionsImpl,
  BlogActions,
  BlogActionsImpl,
} from './../controllers'
import { UserType } from './GraphQLUser'
import { UserInfoType, UserRole, UserTypeInput } from './GraphQLUserInfo'
import { EventType, EventInputType, EventCreateType } from './GraphQLEvent'
import { BlogType, BlogInputType } from './GraphQLBlog'
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql'
import { authenticate } from '../config/passport'
import * as User from '../models/User'

const userCtrl: UserActions = new UserActionsImpl()
const eventCtrl: EventActions = new EventActionsImpl()
const blogCtrl: BlogActions = new BlogActionsImpl()

function requireAuth<A>(req: any, res: any, body: () => A) {
  return new Promise((resolve) => {
    authenticate(req, res, () => {
      resolve(body())
    })
  })
}

function getUserRoles() {
  return [
    User.UserRole.ProjectManager,
    User.UserRole.EventGroup,
    User.UserRole.EventGroupManager,
    User.UserRole.FinanceGroup,
    User.UserRole.FinanceGroupManager,
    User.UserRole.InfoGroup,
    User.UserRole.InfoGroupManager,
    User.UserRole.ItGroup,
    User.UserRole.ItGroupManager,
    User.UserRole.SalesGroup,
    User.UserRole.SalesGroupManager,
    User.UserRole.TravelGroup,
    User.UserRole.TravelGroupManager,
  ]
}

const schema = new GraphQLSchema({
  types: [],
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
        // tslint:disable-next-line:max-line-length
        description:
          'Get a list of users of the given user role and year. If role is null all users are returned',
        type: new GraphQLList(UserType),
        args: {
          userRole: { type: UserRole },
          studsYear: { type: GraphQLInt },
        },
        async resolve(a, { userRole, studsYear }, { req, res }) {
          return await userCtrl.getUsers(
            req,
            res,
            userRole,
            studsYear
          )
        },
      },
      event: {
        description: 'Get a specific event',
        type: EventType,
        args: {
          eventId: { type: GraphQLString },
        },
        async resolve(a, { eventId }, { req, res }) {
          return await eventCtrl.getEvent(eventId)
        },
      },
      events: {
        description: 'Get all events as a list',
        type: new GraphQLList(EventType),
        args: {
          studsYear: { type: GraphQLInt },
        },
        async resolve(a, { studsYear }, { req, res }) {
          return await eventCtrl.getEvents(studsYear)
        },
      },
      blogPosts: {
        description: 'Get all blog posts as a list',
        type: new GraphQLList(BlogType),
        async resolve(a, b, { req, res }) {
          const blogPosts = await blogCtrl.getBlogPosts()
          console.log(blogPosts.slice(0, 3))
          return await blogCtrl.getBlogPosts()
        },
      },
      userRoles: {
        description: 'Get all user roles',
        type: new GraphQLList(UserRole),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res, () => getUserRoles())
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      userUpdate: {
        description: 'Update user information of user with ID or logged in user',
        type: UserType,
        args: {
          id: { type: GraphQLString },
          user: { type: UserTypeInput },
        },
        async resolve(a, { id, user }, { req, res }) {
          return await requireAuth(req, res, () =>
            userCtrl.updateUserInfo(id, req.user, user)
          );
        },
      },
      userDelete: {
        description: 'Delete user information of user with ID',
        type: UserType,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res, () =>
            userCtrl.deleteUser(id, req.user)
          )
        },
      },
      eventCreate: {
        description: 'Create an event with specified information',
        type: EventType,
        args: {
          fields: { type: EventInputType },
        },
        async resolve(a, { fields }, { req, res }) {
          return await requireAuth(req, res, () =>
            eventCtrl.createEvent(req.user, fields)
          )
        },
      },
      eventUpdate: {
        description: 'Update event information of specified ID',
        type: EventType,
        args: {
          id: { type: GraphQLString },
          fields: {
            type: EventInputType,
          },
        },
        async resolve(a, { id, fields }, { req, res }) {
          return await requireAuth(req, res, () =>
            eventCtrl.updateEvent(req.user, id, fields)
          )
        },
      },
      eventDelete: {
        description: 'Delete an event specified by id',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res, () =>
            eventCtrl.deleteEvent(req.user, id)
          )
        },
      },
      blogCreate: {
        description: 'Create a new blogpost',
        type: BlogType,
        args: {
          fields: { type: BlogInputType },
        },
        async resolve(a, { fields }, { req, res }) {
          return await requireAuth(req, res, () =>
            blogCtrl.createBlogPost(req.user, fields)
          )
        },
      },
      blogPostUpdate: {
        description: 'Update blogpost with provided id',
        type: BlogType,
        args: {
          id: { type: GraphQLID },
          fields: { type: BlogInputType },
        },
        async resolve(a, { id, fields }, { req, res }) {
          return await requireAuth(req, res, () =>
            blogCtrl.updateBlogPost(id, fields)
          )
        },
      },
      blogPostDelete: {
        description: 'Remove blogpost with provided id',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res, () =>
            blogCtrl.deleteBlogPost(id)
          )
        },
      },
    },
  }),
})

export default schema
