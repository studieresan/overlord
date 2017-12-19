export function cast<T>(): (t: any) => Promise<T> {
  return (t: any) => t
    ? Promise.resolve(t as T)
    : Promise.reject('Failed promise cast')
}

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
