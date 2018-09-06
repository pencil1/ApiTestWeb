import { hasOwn } from './hasOwn'

export const extend = Object.assign || function (target) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i]
    for (let key in source) {
      if (hasOwn(source, key)) target[key] = source[key]
    }
  }
  return target
}
