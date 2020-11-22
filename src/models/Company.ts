import { CompanyContact, User } from '.'
import { CompanySalesStatus } from './CompanySalesStatus'

export interface Company {
  readonly id: string
  name: string
  companyContacts: CompanyContact[]
  years: CompanyYear[]
}

export interface CompanyYear {
  status: CompanySalesStatus
  studsYear: number
  responsibleUser: User
  amount: number
}
