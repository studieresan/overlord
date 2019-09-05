import { CompanyContactActions } from './CompanyContactActions'
import { CompanyContact } from '../models'
import * as mongodb from '../mongodb/CompanyContact'
import { ObjectID } from 'mongodb'

export class CompanyContactActionsImpl implements CompanyContactActions {

  getContacts(companyId: string): Promise<CompanyContact[]> {
    return new Promise<CompanyContact[]>((resolve, reject) => {
      return resolve(mongodb.CompanyContact.find({company: new ObjectID(companyId)},
          {
            'name': true,
            'id': true,
            'email': true,
            'phoneNumber': true,
            'comment:': true,
          }
        ).exec())
    })
  }

  createContact(companyId: string, fields: Partial<CompanyContact>):
  Promise<CompanyContact> {
    const contact = new mongodb.CompanyContact({
      company: new ObjectID(companyId),
      ...fields,
    })
    return contact.save()
  }

  removeContact(id: string): Promise<boolean> {
    return mongodb.CompanyContact.findOneAndRemove({ _id: id })
      .then(contact => {
        return (contact != undefined)
      })
  }
}
