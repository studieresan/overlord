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
  responsible: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  beforeSurveys: [String],
  afterSurveys: [String],
  pictures: [String],
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  checkedInUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  notCheckedInUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

export const Event =
  mongoose.model<EventDocument>('Event', eventSchema)

export const OldEvent =
  mongoose.model<EventDocument>('OldEvent', eventSchema)
