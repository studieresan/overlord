import { Company, User } from '.'

export interface SalesComment {
    readonly text: String
    readonly timestamp: Date
    readonly company: Company
    readonly user: User
  }