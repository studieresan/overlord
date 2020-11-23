import { CompanyActions } from './CompanyActions'
import { SalesCommentActionsImpl } from './SalesCommentActionsImpl'
import { Company, User } from '../models'
import * as mongodb from '../mongodb/Company'
import { hasEventOrAdminPermissions, rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

// TODO: Modularize how salesComments are populated. Now they are being populated similarly
// in getCompanies and getCompany
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

            // Make a dictionary of companyID -> comments. Faster to find all comments of a company
            const companyComments = {}
            allComments.forEach(comment => {
              const companyID = comment.company.id
              if (!companyComments[companyID])
                companyComments[companyID] = []
              companyComments[companyID].push(comment)
            })

            return Promise.all(
              companies.map(async (c) => {
                return {
                  ...c['_doc'],
                  id: c['_id'],
                  statuses: c.years.map(year => ({
                    studsYear: year.studsYear,
                    responsibleUser: year.responsibleUser,
                    statusDescription: year.status && year.status.name,
                    statusPriority: year.status && year.status.priority,
                    salesComments: companyComments[c['_id']],
                  })),
                }
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
      .then(company => ({
          ...company['_doc'],
          id: company['_id'],
          statuses: company.years.map(year => ({
            studsYear: year.studsYear,
            responsibleUser: year.responsibleUser,
            statusDescription: year.status && year.status.name,
            statusPriority: year.status && year.status.priority,
            salesComments: new SalesCommentActionsImpl().getCommentsOfCompany(company['_id']),
          })),
      }))
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
    companyID: string,
    fields: Partial<Company>
  ): Promise<Company> {
    return new Promise<Company>((resolve, reject) => {
      if (!hasEventOrAdminPermissions(user)) {
        return reject(new Error('User not authorized to do this'))
      }
      return resolve(
        mongodb.Company.findOneAndUpdate(
          { _id: companyID },
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
