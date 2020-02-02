import * as mongoose from 'mongoose'
import * as models from '../models'

export type ContactRequestDocument = mongoose.Document & models.ContactRequest

const ContactRequestSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, unique: true },
  resolved: { type: Boolean, default: false },
  priority: { type: Number },
}, { timestamps: true })

export const ContactRequest = mongoose.model<ContactRequestDocument>(
  'ContactRequest', ContactRequestSchema)
