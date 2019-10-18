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

export function hasSufficientPermissions(user: User): boolean {
  return user.permissions.includes(Permission.Events) ||
      user.permissions.includes(Permission.Admin)
}
