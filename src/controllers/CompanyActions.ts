import { Company, User } from '../models'

export interface CompanyActions {
  // Get all companies from a specific year
  getCompanies(): Promise<Company[]>

  // Get company by company id and specific year
  getCompany(companyId: string): Promise<Company>

  // Create a company with given name
  createCompany(name: string): Promise<Company>

  // Update a company with id and year
  updateCompany(
    user: User,
    companyId: string,
    fields: Partial<Company>
  ): Promise<Company>
}
