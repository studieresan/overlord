import { CompanySalesStatus, User } from '.'

export interface Company {
  readonly id: string
  name: string
  years: CompanyYear[]
}

export interface CompanyYear {
  year: number
  amount: number
  status: CompanySalesStatus
  responsibleUser: User
}
