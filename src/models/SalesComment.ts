import { Company, User } from '.'

export interface SalesComment {
    readonly text: String
    readonly studsYear: Number
    readonly createdAt: Date
    readonly company: Company
    readonly user: User
    readonly edited: Boolean
  }