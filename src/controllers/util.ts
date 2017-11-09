export function cast<T>(): (t: any) => Promise<T> {
  return (t: any) => t
    ? Promise.resolve(t as T)
    : Promise.reject('Failed promise cast')
}
