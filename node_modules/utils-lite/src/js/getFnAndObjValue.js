import { isFunction, isObject } from './getType'

export function getFnAndObjValue (target, key) {
  return isFunction(target)
    ? target(key)
    : !isObject(target)
      ? key
      : target[key] != null
        ? target[key]
        : key
}
