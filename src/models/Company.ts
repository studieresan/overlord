import { CompanySalesStatus, User } from ".";

export interface Company {
    readonly id: string
    readonly name: string
    status: CompanySalesStatus
    responsibleUser: User
  }