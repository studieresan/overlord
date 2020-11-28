import * as mongodb from '../mongodb/CV'
import * as userDb from '../mongodb/User'
import { CVActions } from './CVActions'
import { CV, createDefaultCV, User } from '../models'
import { hasEventOrAdminPermissions } from './util'

export class CVActionsImpl implements CVActions {

  getCV(userId: string): Promise<CV> {
    return mongodb.CV.findOne({ userId })
      .then(cv => {
        return cv ? cv : createDefaultCV(userId)
      })
  }

  updateCV(userId: string, fields: Partial<CV>): Promise<CV> {
    return mongodb.CV.findOneAndUpdate(
        { userId },
        fields
    ).then(cv => {
      console.log('CV', cv)
      if (cv) // If CV exist, just continue. Else create new CV
        return cv
      return mongodb.CV.create({
        userId: userId,
        ...fields,
      })
    })
      // return mongodb.CV.findOne({ userId }).then(cv => {
      // 	if (!cv) {
      // 		const newCV = createDefaultCV(userId)
      // 		console.log('Created new CV', newCV)
      // 		return mongodb.CV.create(newCV)
      // 			.then(() => newCV)
      // 	}
      // 	console.log('CV not null')
      // 	return cv.update({
      // 		...cv,
      // 		...fields,
      // 	})
      // }).then(cv => {
      // 	console.log('CV UPDATED')
      // 	return cv

      // })
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
