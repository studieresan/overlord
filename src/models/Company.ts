import { CompanySalesStatus, User } from '.'

  export interface Company {
    readonly id: string
    readonly name: string
    readonly amount: number
    status: CompanySalesStatus
  }

  export interface CompanyWithSeveralUsers extends Company {
      responsibleUsers: User[]
    }

  export interface CompanyWithOneUser extends Company {
    responsibleUser: User
  }