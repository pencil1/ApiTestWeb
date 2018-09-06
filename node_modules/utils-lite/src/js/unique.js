export function unique (arr) {
  const result = []
  arr.forEach(item => {
    if (!~result.indexOf(item)) result.push(item)
  })
  return result
}
