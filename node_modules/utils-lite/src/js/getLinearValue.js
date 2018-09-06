export function getLinearValue (x1, y1, x2, y2, x3) {
  const k = (y2 - y1) / (x2 - x1)
  const b = y1 - x1 * k
  if (x3 == null) {
    return { k, b }
  } else {
    return x3 * k + b
  }
}
