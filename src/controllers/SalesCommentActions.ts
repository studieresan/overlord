import { SalesComment } from '../models'

export interface SalesCommentActions {

  // Get all comments for a company with id
  getComments(companyId: String): Promise<SalesComment[]>

}
