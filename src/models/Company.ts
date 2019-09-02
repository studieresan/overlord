import { CompanySalesStatus, User } from '.'

export interface Company {
    readonly id: string
    readonly name: string
    contact: String,
    phoneNumber: String,
    email: String,
    contactComment: String,
    status: CompanySalesStatus
    responsibleUser: User
  }