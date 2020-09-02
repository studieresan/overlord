import { CompanyActions } from './CompanyActions'
import { Company, CompanyYear } from '../models'
import * as mongodb from '../mongodb/Company'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

export class CompanyActionsImpl implements CompanyActions {
  getCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(
        mongodb.Company.find(
          {},
          {
            name: true,
            id: true,
            years: true,
          }
        )
          .populate('years.status')
          .populate('years.responsibleUser')
          .exec()
      )
    })
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
    id: string,
    year: number,
    fields: Partial<Company> & Partial<CompanyYear>
  ): Promise<Company> {
    return mongodb.Company.findById(new ObjectID(id))
      .then(rejectIfNull('No company exists for given id'))
      .then((company) => {
        if (fields.name) {
          company.name = fields.name
        }
        delete fields['name']
        const companyFields = fields as CompanyYear

        const yearToEdit = company.years.find((y) => y.year === year)
        if (yearToEdit) {
          for (const key in companyFields) {
            // Typescript does not realize that yearToEdit and companyFields are
            // both of type CompanyYear, and thus have the same keys...
            // @ts-ignore: Unreachable code error
            yearToEdit[key] = companyFields[key]
          }
        } else {
          const newYear = {
            ...companyFields,
            year: year,
          }
          if (!newYear.status) {
            newYear.status = process.env.DEFAULT_STATUS_ID
          }
          company.years = company.years.concat([newYear])
        }
        return company
          .save()
          .then((newCompany) =>
            newCompany
              .populate('years.status')
              .populate('years.responsibleUser')
              .execPopulate()
          )
      })
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
