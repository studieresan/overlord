import * as mongoose from 'mongoose'
import * as models from '../models'

export type CompanySalesStatusDocument = mongoose.Document & models.CompanySalesStatus

const CompanySalesStatusSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, unique: true },
  priority: { type: Number },
}, { timestamps: false })

export const CompanySalesStatus = mongoose.model<CompanySalesStatusDocument>(
  'CompanySalesStatus', CompanySalesStatusSchema)
