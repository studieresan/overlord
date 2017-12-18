import { FeedbackActions } from './FeedbackActions'
import * as models from '../models'
import * as mongodb from '../mongodb/Feedback'
import { cast } from './util'

export class FeedbackActionsImpl implements FeedbackActions {

  createFeedback(companyId: string): Promise<models.Feedback> {
    return mongodb.Feedback.findOne({ companyId })
      .then(feedback => {
        if (feedback) {
          return feedback
        } else {
          const defaultFeedback = models.createDefaultFeedback(companyId)
          const feedback = new mongodb.Feedback(defaultFeedback)
          feedback.save()
          return feedback
        }
      })
      .then(cast<models.Feedback>())
  }

  getFeedback(companyId: string): Promise<models.Feedback> {
    return mongodb.Feedback.findOne({ companyId })
    .then(feedback => {
      if (feedback) {
        return Promise.resolve(feedback as models.Feedback)
      } else {
        return Promise.reject('No feedback for given companyId found.')
      }
    })
  }

  getAllFeedback(): Promise<models.Feedback[]> {
    return mongodb.Feedback.find()
      .then(cast<models.Feedback[]>())
  }

  updateFeedback(companyId: string, fields: Partial<models.Feedback>):
    Promise<models.Feedback> {
    return mongodb.Feedback.findOneAndUpdate(
      { companyId },
      { ...fields, companyId },
      { upsert: true, new: true }
    ).then(cast<models.Feedback>())
  }

}
