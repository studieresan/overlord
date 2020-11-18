import { User } from '.'

export interface SalesComment {
    content: String
    readonly createdAt: Date
    author: User
}