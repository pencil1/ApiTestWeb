import { isObject, isArray } from './getType'

export function clone (v) {
  if (isObject(v)) return Object.assign({}, v)
  if (isArray(v)) return v.slice()
}

export function cloneDeep (v) {
  return JSON.parse(JSON.stringify(v))
}
