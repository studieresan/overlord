import * as mongodb from '../mongodb/User'
import * as passport from 'passport'
import { UserActions } from './UserActions'
import { User, UserInfo, UserRole } from '../models'
import { merge } from 'ramda'
import { hasAdminPermission, rejectIfNull } from './util'
import { CVActionsImpl } from './CVActionsImpl'

export class UserActionsImpl implements UserActions {
  getUserInfo(id: string): Promise<UserInfo> {
    return mongodb.User.findById(id)
    .then(rejectIfNull('No user matches email'))
    .then(user => new CVActionsImpl().getCV(user.id).then(cv => {
      console.log('Got cv ', cv)
      user.info.cv = cv
      return user.info
    }))
  }

  // This should be able to be removed when JWT uses ID instead of email
  getUserOfEmail(email: string): Promise<User> {
    return mongodb.User.findOne({ 'info.email': email })
    .then(rejectIfNull('No user matches email'))
    .then(user => new CVActionsImpl().getCV(user.id).then(cv => {
      user.info.cv = {
        sections: [{
          title: "Hej"
        }]
      }
      console.log('EMAIL THINGIER', cv, user)
      return user
    }))
  }

  deleteUser(userID: string, requestUser: User): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (userID === requestUser.id) {
        return reject('Cannot delete yourself')
      } else if (!hasAdminPermission(requestUser)) {
        return reject('User is not authorized to perform this')
      }

      return resolve(
        mongodb.User.findOneAndUpdate(
          { _id: userID },
          { info: undefined },
          { new: true })
          .exec()
          .then(rejectIfNull('No user with id'))
      )
    })
  }

  updateUserInfo(
    userID: string,
    requestUser: User,
    newFields: Partial<UserInfo>
  ): Promise<UserInfo> {
    return new Promise<UserInfo>((resolve, reject) => {
      // If the user tries to edit other user, must have admin permission
      if (!userID) {
        userID = requestUser.id
      } else if (
        userID !== requestUser.id &&
        !hasAdminPermission(requestUser)
      ) {
        return reject(Error('User not authorized to edit other user'))
      }
      return mongodb.User.findById(userID)
        .then(rejectIfNull('No user matches id'))
        .then((user) => {
          const newInfo = merge(user.info, newFields)
          user.info = newInfo
          return user
            .save()
            .then((user) => user.info)
            .then((info) => {
              if (newFields.cv) {
                return new CVActionsImpl()
                  .updateCV(userID, newFields.cv).then(() => {
                  return resolve(info)
                })
              }
                return resolve(info)
            })
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
            resolve(mongodb.User.find({}).exec())
          } else if (!userRole) {
            // All infos
            resolve(
              mongodb.User.find(
                { studsYear: studsYear },
                {}
              ).exec()
            )
          } else {
            resolve(
              mongodb.User.find(
                {
                  'info.userRole': userRole,
                  studsYear: studsYear,
                },
                {}
              ).exec()
            )
          }
        }
      )(req, res, () => {})
    })
  }
}
