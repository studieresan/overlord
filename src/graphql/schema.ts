import {
  UserActions,
  UserActionsImpl,
  EventActions,
  EventActionsImpl,
  CompanyActions,
  CompanyActionsImpl,
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
      // companyCreate: {},
      // companyContactUpdate: {},
      // companyContactCreate: {},
      // companyContactDelete: {},
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
          //   // createComment: {
    //   //   description:
    //   //     'Create new comment for a company specified by the company ID',
    //   //   type: SalesComment,
    //   //   args: {
    //   //     companyId: { type: GraphQLString },
    //   //     text: { type: GraphQLString },
    //   //   },
    //   //   async resolve(a, { companyId, text }, { req, res }) {
    //   //     return await requireAuth(req, res, () =>
    //   //       salesCommentCtrl.createComment(req.user, companyId, text)
    //   //     )
    //   //   },
    //   // },
    //   // updateComment: {
    //   //   description: 'Update the comment with the given ID',
    //   //   type: SalesComment,
    //   //   args: {
    //   //     id: { type: GraphQLString },
    //   //     text: { type: GraphQLString },
    //   //   },
    //   //   async resolve(a, { id, text }, { req, res }) {
    //   //     return await requireAuth(req, res, () =>
    //   //       salesCommentCtrl.updateComment(req.user, id, text)
    //   //     )
    //   //   },
    //   // },
    //   removeComment: {
    //     description: 'Remove comment with a given contact ID',
    //     type: GraphQLBoolean,
    //     args: {
    //       id: { type: GraphQLString },
    //     },
    //     async resolve(a, { id }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         salesCommentCtrl.removeComment(req.user, id)
    //       )
    //     },
    //   },
    //   createCompany: {
    //     description: 'Create a company with name',
    //     type: Company,
    //     args: {
    //       name: { type: GraphQLString },
    //       statusId: { type: GraphQLString },
    //     },
    //     async resolve(a, { name }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyCtrl.createCompany(name)
    //       )
    //     },
    //   },
    //   createCompanies: {
    //     description: 'Create companies with specified names',
    //     args: {
    //       names: { type: GraphQLString },
    //     },
    //     type: new GraphQLList(Company),
    //     async resolve(a, { names }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyCtrl.bulkCreateCompanies(names)
    //       )
    //     },
    //   },
    //   updateCompany: {
    //     description: 'Update the company with the given ID for the given year',
    //     type: Company,
    //     args: {
    //       id: { type: GraphQLString },
    //       year: { type: GraphQLInt },
    //       fields: { type: CompanyInput },
    //     },
    //     async resolve(a, { id, year, fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyCtrl.updateCompany(id, year, fields)
    //       )
    //     },
    //   },
    //   setAllCompaniesStatus: {
    //     description: 'Update the status of all companies without any',
    //     type: new GraphQLList(Company),
    //     args: {
    //       id: { type: GraphQLString },
    //     },
    //     async resolve(a, { id }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyCtrl.setCompaniesStatus(id)
    //       )
    //     },
    //   },
    //   createContact: {
    //     description:
    //       'Create new contact for a company specified by the company ID',
    //     type: CompanyContact,
    //     args: {
    //       companyId: { type: GraphQLString },
    //       fields: { type: CompanyContactInput },
    //     },
    //     async resolve(a, { companyId, fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyContactCtrl.createContact(companyId, fields)
    //       )
    //     },
    //   },
    //   updateContact: {
    //     description: 'Update the contact with the given ID',
    //     type: CompanyContact,
    //     args: {
    //       id: { type: GraphQLString },
    //       fields: { type: CompanyContactInput },
    //     },
    //     async resolve(a, { id, fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyContactCtrl.updateContact(id, fields)
    //       )
    //     },
    //   },
    //   removeContact: {
    //     description: 'Remove contact with a given contact ID',
    //     type: GraphQLBoolean,
    //     args: {
    //       id: { type: GraphQLString },
    //     },
    //     async resolve(a, { id }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         companyContactCtrl.removeContact(id)
    //       )
    //     },
    //   },

    //   updateCV: {
    //     description: 'Update the CV of the currently logged in user',
    //     type: CVType,
    //     args: {
    //       fields: { type: CVInputType },
    //     },
    //     async resolve(a, { fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         cvCtrl.updateCV(req.user.id, fields)
    //       )
    //     },
    //   },
    //   createEvent: {
    //     description: 'Create new event tied to company name',
    //     type: EventType,
    //     args: {
    //       companyId: { type: GraphQLString },
    //       fields: { type: EventInputType },
    //     },
    //     async resolve(a, { companyId, fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         eventCtrl.createEvent(
    //           req.user,
    //           companyId,
    //           fields.responsibleUserId,
    //           fields
    //         )
    //       )
    //     },
    //   },
    //   updateEvent: {
    //     description: 'Update the event with given event ID',
    //     type: EventType,
    //     args: {
    //       eventId: { type: GraphQLString },
    //       fields: { type: EventInputType },
    //     },
    //     async resolve(a, { eventId, fields }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         eventCtrl.updateEvent(req.user, eventId, fields)
    //       )
    //     },
    //   },
    //   removeEvent: {
    //     description: 'Remove an event with the given ID',
    //     type: GraphQLBoolean,
    //     args: {
    //       eventId: { type: GraphQLString },
    //     },
    //     async resolve(a, { eventId }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         eventCtrl.removeEvent(eventId)
    //       )
    //     },
    //   },
    //   checkIn: {
    //     description: 'Check in user to the given event',
    //     type: GraphQLBoolean,
    //     args: {
    //       eventId: { type: GraphQLString },
    //     },
    //     async resolve(a, { eventId }, { req, res }) {
    //       return await requireAuth(req, res, () =>
    //         eventCtrl.checkIn(req.user, eventId)
    //       )
    //     },
    //   },
    //   addContactRequest: {
    //     description: 'Add a contact request',
    //     type: ContactRequest,
    //     args: {
    //       email: { type: GraphQLString },
    //     },
    //     async resolve(a, { email }, { req, res }) {
    //       return contactRequestCrtl.addContactRequest(email)
    //     },
    //   },
    },
  }),
})

export default schema
