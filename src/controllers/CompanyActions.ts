import { Company } from '../models'

export interface CompanyActions {

  // Get all companies
  getCompanies(): Promise<Company[]>

  // Get company by company id
  getCompany(companyId: string): Promise<Company>

  // Create a company with given name
  createCompany(name: string): Promise<Company>

  // Create a company with given name
  updateCompany(id: string, fields: Partial<Company>): Promise<Company>
}
