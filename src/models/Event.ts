export interface Event {
  readonly id: string
  readonly companyName: string
  readonly schedule: string
  readonly location: string
  readonly privateDescription: string
  readonly publicDescription: string
  readonly date: Date
  readonly responsible: string,
  readonly beforeSurveys: string[]
  readonly afterSurveys: string[]
  readonly pictures: string[]
  readonly published: boolean
}
