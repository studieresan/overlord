import { ObjectID } from 'mongodb'

export interface CompanyContact {
    readonly id: string
    readonly name: string
    readonly email: string
    readonly phoneNumber: string
    readonly comment: string
    readonly company: ObjectID
}