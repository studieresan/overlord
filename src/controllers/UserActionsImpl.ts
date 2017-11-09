import DB from '../mongodb/User'
import { UserActions } from './UserActions'
import { User, MemberType } from '../models'
import { merge } from 'ramda'
import { cast } from './util'
interface Doc {
  profile: User
}

export class UserActionsImpl implements UserActions {

  getUser(id: string): Promise<User> {
    return DB.findById(id, { profile: 1 })
    .then(cast<Doc>())
    .then((doc: Doc) => doc.profile)
  }

  getUsers(memberType: MemberType): Promise<User[]> {
    return DB.find(
      { 'profile.memberType': memberType },
      { profile: 1, _id: 0 })
    .then(cast<Doc[]>())
    .then((docs: Doc[]) => docs.map(d => d.profile))
  }

  setUser(id: string, newFields: Partial<User>): Promise<User> {
    return DB.findById(id)
      .then((doc: any) => {
        if (doc === null || !doc.profile) {
          return Promise.reject('NULL')
        } else {
          const user: User = merge(doc.profile, newFields)
          doc.profile = user
          doc.save()
          return Promise.resolve(user)
        }
      })
  }
}
