import { Company, CompanyYear } from '../models'

export interface CompanyActions {
  // Get all companies from a specific year
  getCompanies(): Promise<Company[]>

  // Get all sold companies
  getSoldCompanies(): Promise<Company[]>

  // Get company by company id and specific year
  getCompany(companyId: string): Promise<Company>

  // Create a company with given name
  createCompany(name: string): Promise<Company>

  // Create several companies with given names
  bulkCreateCompanies(names: string): Promise<Boolean>

  // Update a company with id and year
  updateCompany(
    id: string,
    year: number,
    fields: Partial<Company> & Partial<CompanyYear>
  ): Promise<Company>

  // Set default company status to all companies
  setCompaniesStatus(statusId: string): Promise<Company[]>
}
