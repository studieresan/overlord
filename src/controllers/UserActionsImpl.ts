import * as mongodb from '../mongodb/User'
import * as passport from 'passport'
import { UserActions } from './UserActions'
import { User, UserInfo, UserRole } from '../models'
import { hasAdminPermission, rejectIfNull } from './util'

export class UserActionsImpl implements UserActions {
  getUserInfo(id: string): Promise<UserInfo> {
    return mongodb.User.findById(id, { info: 1 })
      .then(rejectIfNull('No user matches id'))
      .then((user) => user.info)
  }

  deleteUser(userId: string, requestUser: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (userId === requestUser.id) {
        return reject('Cannot delete yourself')
      } else if (!hasAdminPermission(requestUser)) {
        return reject('User is not authorized to perform this')
      }

      return resolve(
        mongodb.User.findOneAndUpdate(
          { _id: userId },
          { info: undefined },
          { new: true })
          .exec()
          .then(rejectIfNull('No user with id'))
      )
    })
  }

  updateUserInfo(
    userId: string,
    requestUser: User,
    newFields: Partial<UserInfo>
  ): Promise<UserInfo> {
    return new Promise<UserInfo>((resolve, reject) => {
      // If the user tries to edit other user, must have admin permission
      if (!userId) {
        userId = requestUser.id
      } else if (
        userId !== requestUser.id &&
        !hasAdminPermission(requestUser)
      ) {
        return reject(Error('User not authorized to edit other user'))
      }
      return mongodb.User.findById(userId)
        .then(rejectIfNull('No user matches id'))
        .then((user) => {
          for (const k in newFields) {
            user.info[k] = newFields[k]
          }
          return user
            .save()
            .then((user) => user.info)
            .then((info) => resolve(info))
        })
    })
  }

  getUsers(
    req: any,
    res: any,
    userRole: UserRole,
    studsYear: number
  ): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: any, info: any) => {
          if (err) {
            reject(
              Error(
                `Error occured when authenticating user: ${err}`
              )
            )
          }
          if (!userRole && !studsYear) {
            resolve(mongodb.User.find({}).sort({firstName: 1}).exec())
          } else if (!userRole) {
            // All infos
            resolve(
              mongodb.User.find(
                { studsYear: studsYear },
                {}
              ).sort({firstName: 1}).exec()
            )
          } else {
            resolve(
              mongodb.User.find(
                {
                  'info.userRole': userRole,
                  studsYear: studsYear,
                },
                {}
              ).sort({firstName: 1}).exec()
            )
          }
        }
      )(req, res, () => {})
    })
  }
}
