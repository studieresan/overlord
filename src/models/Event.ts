import { Company, User } from '.'

export interface Event {
  readonly id: string
  readonly company: Company
  readonly responsible: User
  readonly location: string
  readonly privateDescription: string
  readonly publicDescription: string
  readonly date: Date
  readonly studsYear: number
  readonly beforeSurvey: string
  readonly afterSurvey: string
  readonly pictures: string[]
  readonly published: boolean
}
