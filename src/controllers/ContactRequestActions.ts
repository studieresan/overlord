import { ContactRequest } from '../models'

export interface ContactRequestActions {

  // Get all contact requests
  getContactRequests(): Promise<ContactRequest[]>

  // Create a new contact request
  addContactRequest(email: string): Promise<ContactRequest>

}
