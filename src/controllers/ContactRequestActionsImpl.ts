import * as mongodb from '../mongodb/ContactRequest'
import { ContactRequestActions } from './ContactRequestActions'
import { ContactRequest } from '../models'

export class ContactRequestActionsImpl implements ContactRequestActions {

  getContactRequests(): Promise<ContactRequest[]> {
    return mongodb.ContactRequest.find().sort([['createdAt', 'desc']]).exec()
  }

  addContactRequest(email: string): Promise<ContactRequest> {
    const contactRequest = new mongodb.ContactRequest({
        email,
      })
      return contactRequest.save()
  }

}
