import * as mongoose from 'mongoose'
import * as models from '../models'

export type SalesCommentDocument = mongoose.Document & models.SalesComment

const SalesCommentSchema: mongoose.Schema = new mongoose.Schema({
  text: String,
  studsYear: Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  edited: Boolean,
}, {timestamps: true})

export const SalesComment = mongoose.model<SalesCommentDocument>(
  'SalesComment', SalesCommentSchema)