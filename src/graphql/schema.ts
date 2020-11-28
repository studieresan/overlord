import {
  UserActions,
  UserActionsImpl,
  EventActions,
  EventActionsImpl,
  CompanyActions,
  CompanyActionsImpl,
  CompanyContactActions,
  CompanyContactActionsImpl,
  SalesCommentActions,
  SalesCommentActionsImpl,

} from './../controllers'
import { UserType } from './GraphQLUser'
import {
  UserInfoType,
  UserInfoInputType,
  UserRole,
} from './GraphQLUserInfo'
import { EventType, EventInputType, EventCreateType } from './GraphQLEvent'
import { Company, CompanyInput } from './GraphQLCompany'
import { CompanyContact, CompanyContactInput } from './GraphQLCompanyContact'
import { SalesComment, SalesCommentInput } from './GraphQLSalesComment'
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql'
import * as passportConfig from '../config/passport'
import * as User from '../models/User'

const userCtrl: UserActions = new UserActionsImpl()
const eventCtrl: EventActions = new EventActionsImpl()
const companyCtrl: CompanyActions = new CompanyActionsImpl()
const salesCommentCtrl: SalesCommentActions = new SalesCommentActionsImpl()
const companyContactCtrl: CompanyContactActions = new CompanyContactActionsImpl()

function requireAuth<A>(req: any, res: any, body: () => A) {
  return new Promise((resolve) => {
    passportConfig.authenticate(req, res, () => {
      resolve(body())
    })
  })
}

function getUserRoles() {
  return [
    User.UserRole.ProjectManager,
    User.UserRole.EventGroup,
    User.UserRole.FinanceGroup,
    User.UserRole.InfoGroup,
    User.UserRole.ItGroup,
    User.UserRole.SalesGroup,
    User.UserRole.TravelGroup,
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
          return await requireAuth(req, res, () => {
            console.log('USER: ', req.user)
            return req.user
          })
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
          return await userCtrl.getUsers(req, res, userRole, studsYear)
        },
      },
      company: {
        description: 'Get company information specified by an id',
        type: Company,
        args: {
          companyId: { type: GraphQLString },
        },
        async resolve(root, { companyId }, { req, res }) {
          return await requireAuth(req, res, () =>
            companyCtrl.getCompany(companyId)
          )
        },
      },
      companies: {
        description: 'Get all companies as a list specified by a year',
        type: new GraphQLList(Company),
        async resolve(root, b, { req, res }) {
          return await requireAuth(req, res, () => companyCtrl.getCompanies())
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
          return await eventCtrl.getEvents(req, res, studsYear)
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
        type: UserInfoType,
        args: {
            id: { type: GraphQLString },
            info: {
                type: UserInfoInputType,
            },
        },
        async resolve(a, { id, info }, { req, res }) {
            return await requireAuth(req, res, () =>
              userCtrl.updateUserInfo(id, req.user, info)
            )
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
      eventCreate: {
        description: 'Create an event with specified information',
        type: EventType,
        args: {
            fields: { type: EventCreateType },
        },
        async resolve(a, { fields }, { req, res }) {
            return await requireAuth(req, res, () =>
              eventCtrl.createEvent(req.user, fields)
            )
        },
      },
      eventDelete: {
        description: 'Delete an event specified by eventID',
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
      companyUpdate: {
        description: 'Update company information of specified ID',
        type: Company,
        args: {
            id: { type: GraphQLString },
            fields: {
                type: CompanyInput,
            },
        },
        async resolve(a, { id, fields }, { req, res }) {
            return await requireAuth(req, res, () =>
              companyCtrl.updateCompany(req.user, id, fields)
            )
        },
      },
      companyCreate: {
        description: 'Create company',
        type: Company,
        args: {
            name: { type: GraphQLString },
        },
        async resolve(a, { name }, { req, res }) {
          return await requireAuth(req, res, () =>
            companyCtrl.createCompany(name)
          )
        },
      },
      companyContactCreate: {
        description: 'Create new contact for a company specified by the company ID',
        type: CompanyContact,
        args: {
          id: { type: GraphQLID },
          input: {type: CompanyContactInput},
        },
        async resolve(a, { companyId, input }, { req, res }) {
          return await requireAuth(req, res, () =>
            companyContactCtrl.createContact(companyId, input)
          )
        },
      },
      companyContactUpdate: {
        description: 'Update the contact with the given ID',
        type: CompanyContact,
        args: {
          id: { type: GraphQLID },
          input: {type: CompanyContactInput},
        },
        async resolve(a, { id, input }, { req, res }) {
          return await requireAuth(req, res, () =>
            companyContactCtrl.updateContact(id, input)
          )
        },
      },
      companyContactDelete: {
        description: 'Remove contact with a given contact ID',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res, () =>
            companyContactCtrl.removeContact(id)
          )
        },
      },
      salesCommentUpdate: {
        description: 'Create new comment for a company specified by the company ID',
        type: SalesComment,
        args: {
          input: {type: SalesCommentInput},
        },
        async resolve(a, { input }, { req, res }) {
          salesCommentCtrl.updateComment(req.user, input.companyId, input.text)
        },
      },
      salesCommentCreate: {
        description: 'Create new comment for a company specified by the company ID',
        type: SalesComment,
        args: {
          input: {type: SalesCommentInput},
        },
        async resolve(a, { input }, { req, res }) {
          salesCommentCtrl.createComment(req.user, input.companyId, input.text)
        },
      },
      salesCommentDelete: {
        description: 'Remove comment with a given contact ID',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLID },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res, () =>
            salesCommentCtrl.removeComment(req.user, id)
          )
        },
      },
    },
  }),
})

export default schema
