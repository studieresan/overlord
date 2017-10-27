import DB from '../mongodb/User'
import { UserActions, } from './UserActions'
import { User, MemberType, } from '../models'
import { merge } from 'ramda'

interface Doc {
  profile: User
}

export class UserActionsImpl implements UserActions {

  getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      DB.findById(id, { profile: 1 }, promise<Doc>(resolve, reject))
    }).then(({ profile }: Doc) => profile)
  }

  getUsers(memberType: MemberType): Promise<User[]> {
    return new Promise((resolve, reject) => {
      DB.find(
        { 'profile.memberType': memberType },
        { profile: 1, _id: 0 },
        promise<Doc[]>(resolve, reject)
      )
    }).then((docs: Doc[]) => docs.map(d => d.profile))
  }

  updateUser(id: string, newFields: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      DB.findById(id, (err, doc: any) => {
        if (doc === null || !doc.profile || err) {
          reject(undefined)
        } else {
          const user: User = merge(doc.profile, newFields)
          doc.profile = user
          doc.save()
          resolve(user)
        }
      })
    })
  }
}

function promise<T>(resolve: (t: T) => void, reject: (a: any) => any ) {
  return (err: any, doc: any) => {
    if (err || doc === null) {
      reject(undefined)
    } else {
      console.log(doc)
      resolve(doc)
    }
  }
}

