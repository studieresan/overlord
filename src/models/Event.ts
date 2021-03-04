import { Company, User } from '.'

interface EventFields {
  readonly id: string
  location: string
  privateDescription: string
  publicDescription: string
  date: Date
  studsYear: number
  beforeSurvey: string
  afterSurvey: string
  pictures: string[]
  published: boolean
}

export interface Event extends EventFields {
  company: Company
  responsible: User
}

export interface CreateEvent extends EventFields {
  responsibleUserId: string
  companyId: string
}
