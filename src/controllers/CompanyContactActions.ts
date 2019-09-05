import { CompanyContact } from '../models'

export interface CompanyContactActions {

  // Get all contacts for company specified by company id
  getContacts(companyId: string): Promise<CompanyContact[]>

  // Create a new contact for a company specified by the company id
  createContact(companyId: string, fields: Partial<CompanyContact>): Promise<CompanyContact>
}
