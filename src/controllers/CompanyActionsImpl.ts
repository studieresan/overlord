import { CompanyActions } from './CompanyActions'
import { SalesCommentActionsImpl } from './SalesCommentActionsImpl'
import { Company, SalesComment, User } from '../models'
import * as mongodb from '../mongodb/Company'
import { hasEventOrAdminPermissions, rejectIfNull } from './util'
import { ObjectID } from 'mongodb'
import { CompanyContactActionsImpl } from './CompanyContactActionsImpl'

// Populate the return object of companies with the GraphQL definitions instead of the mongo one
const populateCompany = (mongoCompany: mongodb.CompanyDocument, comments: SalesComment[]) => {
  return {
    ...mongoCompany['_doc'],
    id: mongoCompany.id,
    statuses: mongoCompany.years.map(year => ({
      studsYear: year.studsYear,
      responsibleUser: year.responsibleUser,
      statusDescription: year.status && year.status.name,
      statusPriority: year.status && year.status.priority,
      salesComments: comments,
    })),
    companyContacts: new CompanyContactActionsImpl()
      .getContacts(mongoCompany.id)
      .then(contacts => contacts
        .map(contact => {
          contact['phone'] = contact.phoneNumber
          return contact
        })),
  }
}

export class CompanyActionsImpl implements CompanyActions {
  getCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(
        mongodb.Company.find()
          .populate('years.status')
          .populate('years.responsibleUser')
          .exec()
          .then(async (companies) => {
            const allComments = await new SalesCommentActionsImpl().getComments()

            // Make a dictionary of companyId -> comments. Faster to find all comments of a company
            const companyComments = {}
            allComments.forEach(comment => {
              const companyId = comment.company.toString()
              if (!companyComments[companyId])
                companyComments[companyId] = []
              companyComments[companyId].push(comment)
            })

            return Promise.all(
              companies.map(async (c) => {
                return populateCompany(c, companyComments[c['_id']])
              })
            )
          })
      )
    })
  }

  getCompany(companyId: string): Promise<Company> {
    return mongodb.Company.findById(new ObjectID(companyId))
      .populate('years.status')
      .populate('years.responsibleUser')
      .then(rejectIfNull('No company matches id'))
      .then(async company =>
        populateCompany(
          company,
          await new SalesCommentActionsImpl().getCommentsOfCompany(company['_id'])
        )
      )
  }

  createCompany(name: string): Promise<Company> {
    const company = new mongodb.Company({
      name,
    })
    return company
      .save()
      .then((company) =>
        company
          .populate('years.status')
          .populate('years.responsibleUser')
          .execPopulate()
      )
  }

  updateCompany(
    user: User,
    companyId: string,
    fields: Partial<Company>
  ): Promise<Company> {
    return new Promise<Company>((resolve, reject) => {
      if (!hasEventOrAdminPermissions(user)) {
        return reject(new Error('User not authorized to do this'))
      }
      return resolve(
        mongodb.Company.findOneAndUpdate(
          { _id: companyId },
          { ...fields },
          { new: true }
        )
          .populate('users')
          .populate('companysalesstatuses')
          .exec()
          .then(rejectIfNull('Company does not exist'))
      )
    })
  }
}
