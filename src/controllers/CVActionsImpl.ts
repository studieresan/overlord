import * as mongodb from '../mongodb/CV'
import * as userDb from '../mongodb/User'
import { CVActions } from './CVActions'
import { CV, createDefaultCV, User } from '../models'
import { rejectIfNull, hasEventOrAdminPermissions } from './util'

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

  getAllCVs(auth: User): Promise<CV[]> {
    if (!hasEventOrAdminPermissions(auth))
      return Promise.reject('Insufficient permissions')
    return userDb.User.find({}, {'id': true}).then(users => {
      const userIds = users.map(userId => {
        return userId._id
      })
      return mongodb.CV.find({
        'userId': {
          $in: userIds,
        },
      }).exec()
    })
  }
}
