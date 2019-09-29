import { CompanyActions } from './CompanyActions'
import { Company } from '../models'
import * as mongodb from '../mongodb/Company'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb'
import { reject } from 'bluebird';

export class CompanyActionsImpl implements CompanyActions {

  getCompanies(): Promise<Company[]> {
    return new Promise<Company[]>((resolve, reject) => {
      return resolve(mongodb.Company.find({},
          {
            'name': true,
            'id': true,
            'status': true,
            'responsibleUser': true,
          }
        ).populate('status').populate('responsibleUser').exec())
    })
  }

  getCompany(companyId: string): Promise<Company> {
    return mongodb.Company.findById(new ObjectID(companyId))
      .populate('status')
      .populate('responsibleUser')
      .then(rejectIfNull('No company matches id'))
      .then(company => company)
  }

  createCompany(name: string, statusId: string): Promise<Company> {
    const company = new mongodb.Company(
      {
        name,
        status: statusId,
      })
    return company.save()
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

  updateCompany(id: string, fields: Partial<Company>):
  Promise<Company> {
    return mongodb.Company.findOneAndUpdate(
      { _id: id },
      { ...fields },
      { new: true }
    ).populate('status')
     .populate('responsibleUser')
     .then(rejectIfNull('No company exists for given id'))
  }

  setCompaniesStatus(statusId: string): Promise<Company[]> {
    return mongodb.Company.update(
      { status: null },
      { status: statusId },
      { multi: true }
    ).populate('status')
     .populate('responsibleUser')
     .exec()
  }
}


