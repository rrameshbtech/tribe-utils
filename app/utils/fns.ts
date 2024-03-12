export function pipe<T>(...fns: ((x: T) => T)[]): (x: T) => T{
  return (x: T) => fns.reduce((v, f) => f(v), x)
}
