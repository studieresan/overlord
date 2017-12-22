import { FeedbackActions } from './FeedbackActions'
import * as models from '../models'
import * as mongodb from '../mongodb/Feedback'
import { rejectIfNull } from './util'

export class FeedbackActionsImpl implements FeedbackActions {

  createFeedback(companyId: string): Promise<models.Feedback> {
    return mongodb.Feedback.findOne({ companyId })
      .then(feedback => {
        if (feedback) {
          return feedback
        } else {
          const defaultFeedback = models.createDefaultFeedback(companyId)
          const feedback = new mongodb.Feedback(defaultFeedback)
          return feedback.save()
        }
      })
  }

  getFeedback(companyId: string): Promise<models.Feedback> {
    return mongodb.Feedback.findOne({ companyId })
      .then(rejectIfNull('No feedback exists for specified companyId'))
  }

  getAllFeedback(): Promise<models.Feedback[]> {
    return mongodb.Feedback.find().exec()
  }

  updateFeedback(companyId: string, fields: Partial<models.Feedback>):
    Promise<models.Feedback> {
    return mongodb.Feedback.findOneAndUpdate(
      { companyId },
      { ...fields, companyId },
      { upsert: true, new: true }
    ).then(rejectIfNull('No feedback exists for specified companyId'))
  }

  removeFeedback(companyId: string): Promise<boolean> {
    return mongodb.Feedback.findOneAndRemove({ companyId })
      .then(feedback => {
        return (feedback != undefined)
      })
  }

}
