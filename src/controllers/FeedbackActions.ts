import { Feedback } from '../models'

export interface FeedbackActions {

  // Create new feedback tied to a company
  createFeedback(companyId: string): Promise<Feedback>

  // Get the feedback for a company
  getFeedback(companyId: string): Promise<Feedback>

  // Get the feedback for all companies
  getAllFeedback(): Promise<Feedback[]>

  // Update the feedback for a company, returning the modified feedback
  updateFeedback(companyId: string, fields: Partial<Feedback>):
    Promise<Feedback>

}
