export function throttle (fn, wait, delay) {
  let timer = null
  let previous = null

  return function () {
    const self = this
    const args = arguments
    const now = Date.now()
    if (!previous) previous = now
    if (now - previous > wait) {
      fn.apply(self, args)
      previous = now
    } else if (delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(self, args)
      }, delay)
    }
  }
}
