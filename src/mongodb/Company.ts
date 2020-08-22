import * as mongoose from 'mongoose'
import * as models from '../models'

export type CompanyDocument = mongoose.Document & models.CompanyWithSeveralUsers

const companySchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  amount: Number,
  status: {type: mongoose.Schema.Types.ObjectId, ref: 'CompanySalesStatus'},
  responsibleUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, { timestamps: true })

export const Company = mongoose.model<CompanyDocument>('Company', companySchema)