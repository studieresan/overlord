import { CompanyContact, SalesComment, User } from '.'

// TODO: Typ rimligt?
export interface Company {
  readonly id: string
  name: string
  companyContacts: CompanyContact[]
  years: CompanyYear[]
}

export interface CompanyYear {
  studsYear: number
  responsibleUser: User
  statusDescription: string
  statusPriority: number
  amount: number
  salesComments: SalesComment[]
}
