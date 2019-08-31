import { Company } from '../models'

export interface CompanyActions {

  // Get all companies
  getCompanies(): Promise<Company[]>

  // Get company by company id
  getCompany(companyId: string): Promise<Company>
}
