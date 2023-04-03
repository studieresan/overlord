import { User } from './User'

interface EventFields {
  readonly id: string
  title: string
  description: string
  date: Date
  studsYear: number
  pictures: string[]
  frontPicture: string
  published: boolean
}

export interface Event extends EventFields {
  author: User
}

export interface CreateEvent extends EventFields {
  author: string
}
