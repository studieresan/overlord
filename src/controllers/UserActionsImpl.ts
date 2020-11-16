import * as mongodb from '../mongodb/User'
import * as passport from 'passport'
import { UserActions } from './UserActions'
import { User, UserInfo, UserRole } from '../models'
import { merge } from 'ramda'
import { rejectIfNull } from './util'

export class UserActionsImpl implements UserActions {

  getUserInfo(id: string): Promise<UserInfo> {
    return mongodb.User.findById(id, { info: 1 })
      .then(rejectIfNull('No user matches id'))
      .then(user => user.info)
  }

  updateUserInfo(id: string, newFields: Partial<UserInfo>):
    Promise<UserInfo> {
    return mongodb.User.findById(id)
      .then(rejectIfNull('No user matches id'))
      .then(user => {
        const newInfo = merge(user.info, newFields)
        user.info = newInfo
        return user.save()
          .then(user => user.info)
      })
  }

  getUsers(req: any, res: any, userRole: UserRole, studsYear: number): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      passport.authenticate('jwt', { session: false },
        (err: any, user: any, info: any) => {
          if (err) {
            reject(Error(`Error occured when authenticating user: ${err}`))
          }
          if (!userRole && !studsYear) {
            resolve(mongodb.User.find({}).exec())
          }
          else if (!userRole) {
            // All infos
            resolve(mongodb.User.find(
              {'studsYear': studsYear}, {}
            ).exec())
          } else {
            resolve(mongodb.User.find(
              { 'info.userRole': userRole, 'studsYear': studsYear }, {}
            ).exec())
          }
        }
      )(req, res, () => {})
    })
  }
}
