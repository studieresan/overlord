import * as mongoose from 'mongoose'
import * as models from '../models'

export type EventDocument = mongoose.Document & models.Event

const eventSchema: mongoose.Schema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  studsYear: Number,
  frontPicture: String,
  author: String,
  pictures: [String],
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: { createdAt: 'created' } })

export const Event =
  mongoose.model<EventDocument>('Event', eventSchema, 'events')

export const OldEvent =
  mongoose.model<EventDocument>('OldEvent', eventSchema)
