import { SalesCommentActions } from './SalesCommentActions'
import { SalesComment, User } from '../models'
import * as mongodb from '../mongodb/SalesComment'
import { ObjectID } from 'mongodb'
import { rejectIfNull } from './util'

export class SalesCommentActionsImpl implements SalesCommentActions {

  getComments(companyId: string): Promise<SalesComment[]> {
    return new Promise<SalesComment[]>((resolve, reject) => {
      return resolve(mongodb.SalesComment.find({company: new ObjectID(companyId)},
          {
            'text': true,
            'id': true,
            'company': true,
            'user': true,
            'edited': true,
            'createdAt': true,
          }
        ).sort([['createdAt', 'asc']])
         .populate('company')
         .populate('user')
         .exec())
    })
  }

  createComment(auth: User, companyId: string, text: string): Promise<SalesComment> {
    const event = new mongodb.SalesComment({
      company: new ObjectID(companyId),
      user: auth,
      text,
      edited: false,
    })
    return event.save()
  }

  updateComment(auth: User, id: string, text: string): Promise<SalesComment> {
    return mongodb.SalesComment.findOneAndUpdate(
      { _id: id, user: auth },
      { text, edited: true },
      { new: true }
    ).populate('company')
     .populate('user')
     .then(rejectIfNull('Comment does not exist or insufficient persmission'))
  }

  removeComment(auth: User, id: string): Promise<boolean> {
    return mongodb.SalesComment.findOneAndRemove(
      { _id: id, user: auth }
    ).then(comment => {
      return comment != undefined
    })
  }

}
