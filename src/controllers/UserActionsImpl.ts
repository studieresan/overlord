import * as mongodb from '../mongodb/User'
import * as passport from 'passport'
import { UserActions } from './UserActions'
import { User, UserProfile, MemberType } from '../models'
import { merge } from 'ramda'
import { rejectIfNull } from './util'

export class UserActionsImpl implements UserActions {

  getUserProfile(id: string): Promise<UserProfile> {
    return mongodb.User.findById(id, { profile: 1 })
      .then(rejectIfNull('No user matches id'))
      .then(user => user.profile)
  }

  updateUserProfile(id: string, newFields: Partial<UserProfile>):
    Promise<UserProfile> {
    return mongodb.User.findById(id)
      .then(rejectIfNull('No user matches id'))
      .then(user => {
        const newProfile = merge(user.profile, newFields)
        user.profile = newProfile
        return user.save()
          .then(user => user.profile)
      })
  }

  getUsers(req: any, res: any, memberType: MemberType): Promise<User[]> {
    return new Promise(resolve => {
      passport.authenticate('jwt', { session: false },
        (err: any, user: any, info: any) => {
          if (err) {
            console.log('An error occured')
            resolve(undefined)
          }

          if (user) {
            // All profiles
            const profiles = mongodb.User.find(
              { 'profile.memberType': memberType }, {}
            ).exec()

            resolve(profiles)
          } else {
            // Public profiles
            const publicProfiles = mongodb.User.find(
              { 'profile.memberType': memberType },
              {
                'profile.firstName': true,
                'profile.lastName': true,
                'profile.picture': true,
                'profile.position': true,
                'profile.memberType': true,
              }).exec()

            resolve(publicProfiles)
          }
        }
      )(req, res, () => {})
    })
  }
}
