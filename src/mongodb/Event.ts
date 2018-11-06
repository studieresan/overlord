import * as mongoose from 'mongoose'
import * as models from '../models'

export type EventDocument = mongoose.Document & models.Event

const eventSchema: mongoose.Schema = new mongoose.Schema({
  companyName: String,
  schedule: String,
  location: String,
  privateDescription: String,
  publicDescription: String,
  date: Date,
  beforeSurveys: [String],
  afterSurveys: [String],
  pictures: [String],
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

export const Event =
  mongoose.model<EventDocument>('Event', eventSchema)

export const OldEvent =
    mongoose.model<EventDocument>('OldEvent', eventSchema)
