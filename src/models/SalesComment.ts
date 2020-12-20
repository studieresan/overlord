import { User } from '.'
import { ObjectID } from 'mongodb'

export interface SalesComment {
    text: String
    readonly createdAt: Date
    user: User
    company: ObjectID
}