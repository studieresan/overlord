import * as mongoose from 'mongoose'
import * as models from '../models'

export type EventDocument = mongoose.Document & models.Event

const eventSchema: mongoose.Schema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  studsYear: Number,
  frontPicture: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
