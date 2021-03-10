import * as mongoose from 'mongoose'
import * as models from '../models'

export type HappeningDocument = mongoose.Document & models.Happening

const happeningSchema: mongoose.Schema = new mongoose.Schema({
  title: String,
  emoji: String,
  description: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: {
      type: { type : String },
      geometry: {
        type: { type: String },
        coordinates: [],
      },
      properties: {
        name: { type: String },
      },
  },
}, { timestamps: { createdAt: 'created' } })

export const Happening = mongoose.model<HappeningDocument>('Happening', happeningSchema)