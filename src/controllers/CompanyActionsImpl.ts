import { CompanyActions } from './CompanyActions'
import { Company } from '../models'
import * as mongodb from '../mongodb/Company'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb'

var fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'companies.txt');


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

  createCompany(name: string): Promise<Company> {
    const company = new mongodb.Company({name})
    return company.save()
  }

  

  bulkCreateCompanies(): Promise<Boolean> {
    return fs.readFile(filePath, {encoding: 'utf-8'}, function(err:any,data:string){
      if (!err) {
          const names:string[] = data.split('\n')
          const companies:Company[] = [];
          names.forEach(name => {
            const n = name.slice(1,-1)
            companies.push(new mongodb.Company({name:n}))
          })
          return mongodb.Company.collection.insertMany(companies)
          .then(t => {
            console.log(t)
            return (t != undefined)
            })
      } else {
          console.log(err);
      }
    });
    
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
}
