import * as mongoose from 'mongoose'
import * as models from '../models'

export type CompanyDocument = mongoose.Document & models.Company

const companySchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  years: [{
    year: Number,
    amount: Number,
    status: {type: mongoose.Schema.Types.ObjectId, ref: 'CompanySalesStatus'},
    responsibleUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  }],
}, { timestamps: true })

export const Company = mongoose.model<CompanyDocument>('Company', companySchema)