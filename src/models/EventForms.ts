import * as mongoose from 'mongoose'

export type Rating = 1 | 2 | 3 | 4 | 5

export enum EventImpact {
  Positive = 'The event had a positive impact on my view of the company',
  Neutral = 'The event had no impact on my view of the company',
  Negative = 'The event had a negative impact on my view of the company',
}

export enum Familiarity {
  Yes = 'Yes',
  Somewhat = 'To some extent',
  No = 'No',
}

export interface EventForm extends mongoose.Document {
  readonly id: string
  readonly userId: string
  readonly eventId: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface PreEventForm extends EventForm {
  readonly interestInRegularWorkBefore: Rating
  readonly interestInCompanyMotivationBefore: string
  readonly familiarWithCompany: Familiarity
  readonly viewOfCompany: string
}

export interface PostEventForm extends EventForm {
  readonly interestInRegularWork: Rating
  readonly interestInCompanyMotivation: string
  readonly eventImpact: EventImpact
  readonly qualifiedToWork: boolean
  readonly atmosphereRating: Rating
  readonly activitiesRating: Rating
  readonly foodRating: Rating
  readonly eventFeedback: string
  readonly eventImprovements: string
}
