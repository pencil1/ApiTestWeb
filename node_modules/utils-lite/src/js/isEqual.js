import { hasOwn } from './hasOwn'
import { getTypeof } from './getType'

export function isEqual (alice, bob) {
  if (alice === bob) return true
  if (alice === null ||
    bob === null ||
    getTypeof(alice) !== 'object' ||
    getTypeof(bob) !== 'object') {
    return alice === bob
  }

  for (let key in alice) {
    if (!hasOwn(alice, key)) continue
    const aliceValue = alice[key]
    const bobValue = bob[key]
    const aliceType = getTypeof(aliceValue)

    if (getTypeof(bobValue) === 'undefined') {
      return false
    } else if (aliceType === 'object') {
      if (!isEqual(aliceValue, bobValue)) return false
    } else if (aliceValue !== bobValue) {
      return false
    }
  }
  for (let key in bob) {
    if (!hasOwn(bob, key)) continue
    if (getTypeof(alice)[key] === 'undefined') return false
  }

  return true
}
