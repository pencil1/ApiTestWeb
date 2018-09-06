export function kebabToCamel (s) {
  return s.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

export function camelToKebab (s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
