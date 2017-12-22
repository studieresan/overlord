import * as mongoose from 'mongoose'
import * as models from '../models'

export type CVDocument = mongoose.Document & models.CV

const cvSchema: mongoose.Schema = new mongoose.Schema({
  userId: { type: String, unique: true },
  text: String,
  sections: { type: [] },
}, { timestamps: true })

export const CV = mongoose.model<CVDocument>('CV', cvSchema)
