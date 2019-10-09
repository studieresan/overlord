import { Company, User } from ".";

export interface Event {
  readonly id: string
  readonly companyName: string
  readonly company: Company
  readonly responsible: User
  readonly schedule: string
  readonly location: string
  readonly privateDescription: string
  readonly publicDescription: string
  readonly date: Date
  readonly beforeSurveys: string[]
  readonly afterSurveys: string[]
  readonly pictures: string[]
  readonly published: boolean
}
