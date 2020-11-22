import { CompanyActions } from './CompanyActions'
import { Company, User } from '../models'
import * as mongodb from '../mongodb/Company'
import { hasEventOrAdminPermissions, rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

// TODO: Fix sales tool
export class CompanyActionsImpl implements CompanyActions {

  getCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(
        mongodb.Company.find()
        .populate('years.status')
        .populate('years.responsibleUser')
        .exec()
        .then(companies => companies.map(c => {
          const object = {
            ...c['_doc'],
            statuses: c.years.map(year =>  {
              return	({
                studsYear: year.studsYear,
                responsibleUser: year.responsibleUser,
                statusDescription: year.status && year.status.name,
                statusPriority: year.status && year.status.priority,
              })
            }),
          }
          return object
        }))
    )})
  }

  getSoldCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(
        mongodb.Company.find(
          {
            status: process.env.DEFAULT_SOLD_STATUS_ID,
          },
          {
            name: true,
            id: true,
            status: true,
            responsibleUser: true,
          }
        )
          .populate('status')
          .populate('responsibleUser')
          .exec()
      )
    })
  }

  getCompany(companyId: string): Promise<Company> {
    return mongodb.Company.findById(new ObjectID(companyId))
      .populate('years.status')
      .populate('years.responsibleUser')
      .then(rejectIfNull('No company matches id'))
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

  bulkCreateCompanies(names: string): Promise<Boolean> {
    const namest: string[] = names.split(',')
    const companies: Company[] = []
    namest.forEach((name) => {
      const n = name.slice(1, -1)
      companies.push(new mongodb.Company({ name: n }))
    })
    return mongodb.Company.collection.insertMany(companies).then((t) => {
      return t != undefined
    })
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
    return resolve(mongodb.Company.findOneAndUpdate(
      { _id: companyID },
      { ...fields },
      { new: true })
      .populate('users')
      .populate('companysalesstatuses')
      .exec()
      .then(rejectIfNull('Company does not exist'))
    )})
  }

  setCompaniesStatus(statusId: string): Promise<Company[]> {
    return mongodb.Company.update(
      { status: undefined },
      { status: statusId },
      { multi: true }
    )
      .populate('status')
      .populate('responsibleUser')
      .exec()
  }
}
