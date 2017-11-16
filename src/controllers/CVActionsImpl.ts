import DB from '../mongodb/CV'
import { CVActions } from './CVActions'
import { CV, createDefaultCV } from '../models'
import { cast } from './util'

export class CVActionsImpl implements CVActions {

  getCV(userId: string): Promise<CV> {
    return DB.findOne({ userId })
      .then(doc => {
        return doc === null
          ? createDefaultCV(userId)
          : doc
      })
      .then(cast<CV>())
  }

  setCV(userId: string, fields: Partial<CV>): Promise<CV> {
    return DB.findOneAndUpdate(
      { userId },
      { userId, ...fields },
      { upsert: true, new: true }
    ).then(cast<CV>())
  }

}
