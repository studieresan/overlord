import * as mongodb from '../mongodb/User'
import { UserActions } from './UserActions'
import { UserProfile, MemberType } from '../models'
import { merge } from 'ramda'
import { rejectIfNull } from './util'

export class UserActionsImpl implements UserActions {

  getUserProfile(id: string): Promise<UserProfile> {
    return mongodb.User.findById(id, { profile: 1 })
      .then(rejectIfNull('No user matches id'))
      .then(user => user.profile)
  }

  getUserProfiles(memberType: MemberType): Promise<UserProfile[]> {
    return mongodb.User.find(
      { 'profile.memberType': memberType },
      { profile: 1, _id: 1 }).exec()
      .then(users => users.map(user => user.profile))
  }

  setUserProfile(id: string, newFields: Partial<UserProfile>):
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
}
