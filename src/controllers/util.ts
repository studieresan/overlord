import { Permission, User } from '../models'

// Wraps a value in a Promise which is rejected with reason if value is null
export function rejectIfNull<T>(reason: string):
  (value: T | null) => Promise<T> {
    return (value => {
      if (!value)
        return Promise.reject(reason)
      else
        return Promise.resolve(value)
    })
}

export function hasEventOrAdminPermissions(user: User): boolean {
  return user.info.permissions.includes(Permission.Events) ||
      user.info.permissions.includes(Permission.Admin)
}

export function hasAdminPermission(user: User): boolean {
    return user.info.permissions && user.info.permissions.includes(Permission.Admin)
}
