import { Company, User } from '.'

export interface SalesComment {
    text: String
    readonly createdAt: Date
    user: User
    company: Company
}