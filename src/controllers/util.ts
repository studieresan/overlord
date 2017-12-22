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
