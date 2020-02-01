import { CompanySalesStatus, User } from '.'

export interface Company {
    readonly id: string
    readonly name: string
    readonly amount: number
    status: CompanySalesStatus
    responsibleUser: User
  }