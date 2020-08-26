import { CompanySalesStatus, User } from '.'

  export interface Company {
    readonly id: string
    name: string
    years: CompanyYear[]
  }

  export interface CompanyYear {
    year: number,
    amount: number,
    status: CompanySalesStatus,
    responsibleUser: User,
  }

  // export interface CompanyWithSeveralUsers extends Company {
  //     responsibleUsers: User[]
  //   }

  // export interface CompanyWithOneUser extends Company {
  //   responsibleUser: User
  // }

  // export function companyFactory(companySeveral: CompanyWithSeveralUsers): CompanyWithOneUser {
  //   const companyOne: CompanyWithOneUser = {
  //     id: companySeveral.id,
  //     name: companySeveral.name,
  //     amount: companySeveral.amount,
  //     status: companySeveral.status,
  //     responsibleUser: companySeveral.responsibleUsers[0],
  //   }
  //   return companyOne
  // }