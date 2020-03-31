import {
  UserActions,
  UserActionsImpl,
  CVActions,
  CVActionsImpl,
  EventActions,
  EventActionsImpl,
  CompanySalesStatusActions,
  CompanySalesStatusActionsImpl,
  CompanyActions,
  CompanyActionsImpl,
  SalesCommentActions,
  SalesCommentActionsImpl,
  CompanyContactActions,
  CompanyContactActionsImpl,
  ContactRequestActions,
  ContactRequestActionsImpl,
} from './../controllers'
import {
  UserType
} from './GraphQLUser'
import {
  UserProfileType,
  UserProfileInputType,
  UserRole,
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
  CompanySalesStatus,
} from './GraphQLECompanySalesStatus'
import {
  Company,
  CompanyInput,
} from './GraphQLCompany'
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql'
import * as passportConfig from '../config/passport'
import { SalesComment } from './GraphQLSalesComment'
import * as User from '../models/User'
import { CompanyContact, CompanyContactInput } from './GraphQLCompanyContact'
import { ContactRequest } from './GraphQLContactRequest'

const userCtrl: UserActions = new UserActionsImpl()
const cvCtrl: CVActions = new CVActionsImpl()
const eventCtrl: EventActions = new EventActionsImpl()
const companySalesStatusCtrl: CompanySalesStatusActions = new CompanySalesStatusActionsImpl()
const companyCtrl: CompanyActions = new CompanyActionsImpl()
const salesCommentCtrl: SalesCommentActions = new SalesCommentActionsImpl()
const companyContactCtrl: CompanyContactActions = new CompanyContactActionsImpl()
const contactRequestCrtl: ContactRequestActions = new ContactRequestActionsImpl()

function requireAuth<A>(req: any, res: any, body: () => A) {
  return new Promise(resolve => {
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
          return await requireAuth(req, res, () => req.user)
        },
      },
      users: {
        // tslint:disable-next-line:max-line-length
        description: 'Get a list of users of the given user role. If role is null all users are returned',
        type: new GraphQLList(UserType),
        args: {
          userRole: { type: UserRole },
        },
        async resolve(a, { userRole }, { req, res }) {
          return await userCtrl.getUsers(req, res, userRole)
        },
      },
      cvs: {
        description: 'Get all current user cvs',
        type: new GraphQLList(CVType),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
             () => cvCtrl.getAllCVs(req.user))
        },
      },
      allEvents: {
        description: 'Get all events as a list',
        type: new GraphQLList(EventType),
        async resolve(a, b, { req, res }) {
          return await eventCtrl.getEvents(req, res)
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
      oldEvents: {
        description: 'Get all old events as a list',
        type: new GraphQLList(EventType),
        async resolve() {
          return await eventCtrl.getOldEvents()
        },
      },
      allCompanySalesStatuses: {
        description: 'Get all events as a list',
        type: new GraphQLList(CompanySalesStatus),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
            () => companySalesStatusCtrl.getCompanySalesStatuses(req, res))
        },
      },
      companies: {
        description: 'Get all companies as a list',
        type: new GraphQLList(Company),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
            () => companyCtrl.getCompanies())
        },
      },
      soldCompanies: {
        description: 'Get all sold companies as a list',
        type: new GraphQLList(Company),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
            () => companyCtrl.getSoldCompanies())
        },
      },
      company: {
        description: 'Get a company specified by an id',
        type: Company,
        args: {
          companyId: { type: GraphQLString },
        },
        async resolve(root, {companyId}, { req, res }) {
          return await requireAuth(req, res,
            () => companyCtrl.getCompany(companyId))
        },
      },
      comments: {
        description: 'Get all comment for the company specified by an id',
        type: new GraphQLList(SalesComment),
        args: {
          companyId: { type: GraphQLString },
          studsYear: { type: GraphQLInt },
        },
        async resolve(root, {companyId, studsYear}, { req, res }) {
          return await requireAuth(req, res,
            () => salesCommentCtrl.getComments(companyId, studsYear))
        },
      },
      userRoles: {
        description: 'Get all user roles',
        type: new GraphQLList(UserRole),
        async resolve(a, b, { req, res }) {
          return await requireAuth(req, res,
            () => getUserRoles())
        },
      },
      contacts: {
        description: 'Get all contacts for the company specified by an id',
        type: new GraphQLList(CompanyContact),
        args: {
          companyId: { type: GraphQLString },
        },
        async resolve(root, {companyId}, { req, res }) {
          return await requireAuth(req, res,
            () => companyContactCtrl.getContacts(companyId))
        },
      },
      contactRequests: {
        description: 'Get all contact requests',
        type: new GraphQLList(ContactRequest),
        async resolve(root, {}, { req, res }) {
          return await requireAuth(req, res,
            () => contactRequestCrtl.getContactRequests())
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
      createSalesStatus: {
        description: 'Create a company sales status with name',
        type: CompanySalesStatus,
        args: {
          name: { type: GraphQLString },
        },
        async resolve(a, {name}, { req, res }) {
          return await requireAuth(req, res,
            () => companySalesStatusCtrl.createSalesStatus(name))
        },
      },
      createCompany: {
        description: 'Create a company with name',
        type: Company,
        args: {
          name: { type: GraphQLString },
          statusId: { type: GraphQLString },
        },
        async resolve(a, {name}, { req, res }) {
          return await companyCtrl.createCompany(name)
        },
      },
      createCompanies: {
        description: 'Create companies with specified names',
        args: {
          names: { type: GraphQLString },
        },
        type: new GraphQLList(Company),
        async resolve(a, {names}, { req, res }) {
          return await companyCtrl.bulkCreateCompanies(names)
        },
      },
      updateCompany: {
        description: 'Update the company with the given ID',
        type: Company,
        args: {
          id: { type: GraphQLString },
          fields: { type: CompanyInput },
        },
        async resolve(a, { id, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => companyCtrl.updateCompany(id, fields))
        },
      },
      setAllCompaniesStatus: {
        description: 'Update the status of all companies without any',
        type: new GraphQLList(Company),
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id}, { req, res }) {
          return await requireAuth(req, res,
            () => companyCtrl.setCompaniesStatus(id))
        },
      },
      createContact: {
        description: 'Create new contact for a company specified by the company ID',
        type: CompanyContact,
        args: {
          companyId: { type: GraphQLString },
          fields: { type: CompanyContactInput },
        },
        async resolve(a, { companyId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => companyContactCtrl.createContact(companyId, fields))
        },
      },
      updateContact: {
        description: 'Update the contact with the given ID',
        type: CompanyContact,
        args: {
          id: { type: GraphQLString },
          fields: { type: CompanyContactInput },
        },
        async resolve(a, { id, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => companyContactCtrl.updateContact(id, fields))
        },
      },
      removeContact: {
        description: 'Remove contact with a given contact ID',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res,
            () => companyContactCtrl.removeContact(id))
        },
      },
      createComment: {
        description: 'Create new comment for a company specified by the company ID',
        type: SalesComment,
        args: {
          companyId: { type: GraphQLString },
          text: { type: GraphQLString},
        },
        async resolve(a, { companyId, text }, { req, res }) {
          return await requireAuth(req, res,
            () => salesCommentCtrl.createComment(req.user, companyId, text))
        },
      },
      updateComment: {
        description: 'Update the comment with the given ID',
        type: SalesComment,
        args: {
          id: { type: GraphQLString },
          text: { type: GraphQLString },
        },
        async resolve(a, { id, text }, { req, res }) {
          return await requireAuth(req, res,
            () => salesCommentCtrl.updateComment(req.user, id, text))
        },
      },
      removeComment: {
        description: 'Remove comment with a given contact ID',
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(a, { id }, { req, res }) {
          return await requireAuth(req, res,
            () => salesCommentCtrl.removeComment(req.user, id))
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
          companyId: { type: GraphQLString },
          fields: { type: EventInputType },
        },
        async resolve(a, { companyId, fields }, { req, res }) {
          return await requireAuth(req, res,
            () => eventCtrl.createEvent(req.user, companyId, fields.responsibleUserId, fields))
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
      checkIn: {
        description: 'Check in user to the given event',
        type: GraphQLBoolean,
        args: {
          eventId: { type: GraphQLString },
        },
        async resolve(a, { eventId }, { req, res }) {
          return await requireAuth(req, res,
            () => eventCtrl.checkIn(req.user, eventId))
        },
      },
      addContactRequest: {
        description: 'Add a contact request',
        type: ContactRequest,
        args: {
          email: { type: GraphQLString },
        },
        async resolve(a, { email }, { req, res }) {
          return contactRequestCrtl.addContactRequest(email)
        },
      },
    },
  }),
})

export default schema
