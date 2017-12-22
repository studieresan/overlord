import * as mongodb from '../mongodb/CV'
import { CVActions } from './CVActions'
import { CV, createDefaultCV } from '../models'
import { rejectIfNull } from './util'

export class CVActionsImpl implements CVActions {

  getCV(userId: string): Promise<CV> {
    return mongodb.CV.findOne({ userId })
      .then(cv => {
        return cv === null
          ? createDefaultCV(userId)
          : cv
      })
  }

  updateCV(userId: string, fields: Partial<CV>): Promise<CV> {
    return mongodb.CV.findOneAndUpdate(
      { userId },
      { userId, ...fields },
      { upsert: true, new: true }
    ).then(rejectIfNull('No CV exists for given id'))
  }

}
