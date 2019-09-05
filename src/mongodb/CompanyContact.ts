import * as mongoose from 'mongoose'
import * as models from '../models'

export type CompanyContactDocument = mongoose.Document & models.CompanyContact

const companyContactSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  comment: String,
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
}, { timestamps: true })

export const CompanyContact = mongoose.model<CompanyContactDocument>
('CompanyContact', companyContactSchema)