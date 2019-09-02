import { SalesCommentActions } from './SalesCommentActions'
import { SalesComment } from '../models'
import * as mongodb from '../mongodb/SalesComment'
import { rejectIfNull } from './util'
import { ObjectID } from 'mongodb';

export class SalesCommentActionsImpl implements SalesCommentActions {

  getComments(companyId: string): Promise<SalesComment[]> {
    return new Promise<SalesComment[]>((resolve, reject) => {
      return resolve(mongodb.SalesComment.find({company: new ObjectID(companyId)},
          {
            'text': true,
            'id': true,
            'company': true,
            'user': true,
          }
        ).populate('company').populate('user').exec())
    })
  }
}
