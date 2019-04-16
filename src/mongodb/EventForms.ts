import * as mongoose from 'mongoose'
import * as models from '../models'

export type PreEventFormDocument = mongoose.Document & models.PreEventForm
export type PostEventFormDocument = mongoose.Document & models.PostEventForm

const preEventFormSchema: mongoose.Schema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  interestInRegularWorkBefore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  interestInCompanyMotivationBefore: {
    type: String,
    required: true,
  },
  familiarWithCompany: {
    type: String ,
    required: true,
    enum: Object.values(models.Familiarity),
  },
  viewOfCompany: {
    type: String,
    required: true,
  },
}, { timestamps: true })

preEventFormSchema.index({ eventId: 1, userId: 1 }, { unique: true })

const postEventFormSchema: mongoose.Schema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  interestInRegularWork: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  interestInCompanyMotivation: {
    type: String,
    required: true,
  },
  eventImpact: {
    type: String,
    required: true,
    enum: Object.values(models.EventImpact),
  },
  qualifiedToWork: {
    type: Boolean,
    required: true,
  },
  atmosphereRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  activitiesRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  foodRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  eventFeedback: {
    type: String,
    required: true,
  },
  eventImprovements: {
    type: String,
    required: true,
  },
}, { timestamps: true })

postEventFormSchema.index({ eventId: 1, userId: 1 }, { unique: true })

export const PreEventForm =
  mongoose.model<PreEventFormDocument>('PreEventForm', preEventFormSchema)

export const PostEventForm =
  mongoose.model<PostEventFormDocument>('PostEventForm', postEventFormSchema)
