import { CompanyActions } from './CompanyActions'
import { Company } from '../models'
import * as mongodb from '../mongodb/Company'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

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
}
