export function debounce (fn, delay) {
  let timer = null
  return function () {
    const self = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(self, args)
    }, delay)
  }
}
