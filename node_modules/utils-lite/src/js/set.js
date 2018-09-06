export function set (target, path, value) {
  if (!path) return
  let targetTemp = target
  const pathArr = path.split('.')
  pathArr.forEach((item, index) => {
    if (index === pathArr.length - 1) {
      targetTemp[item] = value
    } else {
      if (!targetTemp[item]) targetTemp[item] = {}
      targetTemp = targetTemp[item]
    }
  })
}
