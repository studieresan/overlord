import * as mongoose from 'mongoose'
import * as models from '../models'

export type FeedbackDocument = mongoose.Document & models.Feedback

const feedbackSchema: mongoose.Schema = new mongoose.Schema({
  companyId: { type: String, unique: true },
  eventId: String,
  questions: { type: [] },
}, { timestamps: true })

export const Feedback =
  mongoose.model<FeedbackDocument>('Feedback', feedbackSchema)
