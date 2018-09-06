export function getType (v) {
  return Object.prototype.toString.call(v)
}

export function getTypeof (v) {
  return typeof v
}

export function isObject (v) {
  return getType(v) === '[object Object]'
}

export function isArray (v) {
  return getType(v) === '[object Array]'
}

export function isFunction (v) {
  return getType(v) === '[object Function]'
}

export function isString (v) {
  return getType(v) === '[object String]'
}

export function isBoolean (v) {
  return getType(v) === '[object Boolean]'
}

export function isEmptyObj (v) {
  return isObject(v) && !Object.keys(v).length
}

export function isNumber (v) {
  return getType(v) === '[object Number]'
}
