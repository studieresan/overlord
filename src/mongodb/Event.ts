import * as mongoose from 'mongoose'
import * as models from '../models'

export type EventDocument = mongoose.Document & models.Event

const eventSchema: mongoose.Schema = new mongoose.Schema({
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        location: String,
        privateDescription: String,
        publicDescription: String,
        date: Date,
        studsYear: Number,
        published: {
            type: Boolean,
            default: false,
        },
        pictures: [String],
        beforeSurvey: String,
        afterSurvey: String,
    }
, { timestamps: true })

export const Event =
  mongoose.model<EventDocument>('Event', eventSchema)

export const OldEvent =
  mongoose.model<EventDocument>('OldEvent', eventSchema)
