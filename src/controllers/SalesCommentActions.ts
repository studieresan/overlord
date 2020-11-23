import { SalesComment, User } from '../models'

export interface SalesCommentActions {

  // Get all comments
  getComments(): Promise<SalesComment[]>

  // Create a comment for a company with given id
  createComment(auth: User, companyId: string, text: string): Promise<SalesComment>

  // Update a comment with the given id
  updateComment(auth: User, id: string, text: string): Promise<SalesComment>

  // Remove the comment with the given id
  removeComment(auth: User, id: string): Promise<boolean>

}
