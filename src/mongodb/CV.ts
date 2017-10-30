import * as mongoose from 'mongoose'
import {
  CV,
} from '../models'

const cvSchema: mongoose.Schema = new mongoose.Schema({
  userId: { type: String, unique: true },
  text: String,
  sections: { type: [] },
}, { timestamps: true })

const CV = mongoose.model('CV', cvSchema)
export default CV
