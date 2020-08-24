import { CompanyActions } from './CompanyActions'
import { Company, companyFactory, CompanyWithOneUser, User } from '../models'
import * as mongodb from '../mongodb/Company'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

export class CompanyActionsImpl implements CompanyActions {

  getCompanies(studsYear: number): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(mongodb.Company.find({},
          {
            'name': true,
            'amount': true,
            'id': true,
            'status': true,
            'responsibleUsers': true,
          }
        ).populate('status')
        .populate({
          path: 'responsibleUsers',
          match: { 'profile.studsYear': studsYear },
        }).exec().then(companies => companies.map(company =>  companyFactory(company))))
    })
  }

  getSoldCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(mongodb.Company.find(
          {
            status: process.env.DEFAULT_SOLD_STATUS_ID,
          },
          {
            'name': true,
            'id': true,
            'status': true,
            'responsibleUser': true,
          }
        ).populate('status').populate('responsibleUser').exec())
    })
  }

  getCompany(companyId: string, studsYear: number): Promise<Company> {
    return mongodb.Company.findById(new ObjectID(companyId))
      .populate('status')
      .populate({
        path: 'responsibleUsers',
        match: { 'profile.studsYear': studsYear },
      })
      .then(rejectIfNull('No company matches id'))
      .then(company =>  companyFactory(company))
  }

  createCompany(name: string): Promise<Company> {
    const company = new mongodb.Company(
      {
        name,
        status: process.env.DEFAULT_STATUS_ID,
      })
    return company.save().then(company =>
    company.populate('status')
    .populate('responsibleUser')
    .execPopulate())
  }

  bulkCreateCompanies(names: string): Promise<Boolean> {
    const namest: string[] = names.split(',')
    const companies: Company[] = []
    namest.forEach(name => {
      const n = name.slice(1, -1)
      companies.push(new mongodb.Company({name: n}))
    })
    return mongodb.Company.collection.insertMany(companies)
    .then(t => {
      return (t != undefined)
      })
  }

  updateCompany(id: string, studsYear: number, fields: Partial<CompanyWithOneUser>):
  Promise<Company> {
    if (fields.responsibleUser) {
      return this.updateCompanyResponsibleUser(id, studsYear, fields.responsibleUser)
    } else {
      return mongodb.Company.findOneAndUpdate(
        { _id: id },
        { ...fields },
        { new: true }
      ).populate('status')
      .populate('responsibleUser')
      .then(rejectIfNull('No company exists for given id'))
    }
  }

  updateCompanyResponsibleUser(id: string, studsYear: number, newResponsibleUser: User):
  Promise<Company> {
    return mongodb.Company.findById(new ObjectID(id))
    .populate({
      path: 'responsibleUsers',
    })
    .then(rejectIfNull('No company exists for given id'))
    .then(company => {
      if (company.responsibleUsers.length > 0) {
        // If there exist a responsible user for this year, remove that
        company.responsibleUsers = company.responsibleUsers
        .filter(user => user.profile.studsYear != studsYear)
      }
      company.responsibleUsers.push(newResponsibleUser)
      return company.save().then(newCompany => newCompany
        .populate('status')
        .populate({
          path: 'responsibleUsers',
          match: { 'profile.studsYear': studsYear },
        }).execPopulate().then(c =>  companyFactory(c)))
    })
  }

  setCompaniesStatus(statusId: string): Promise<Company[]> {
    return mongodb.Company.update(
      { status: undefined },
      { status: statusId },
      { multi: true }
    ).populate('status')
     .populate('responsibleUser')
     .exec()
  }
}


