export default function compareTwoObjects (a, b) {
  if (a === b) { return true }
  if (a instanceof Date && b instanceof Date) { return a.getTime() === b.getTime() }
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) { return a === b }
  if (a.prototype !== b.prototype) { return false }
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) { return false }
  return keys.every(k => this.compareTwoObjects(a[k], b[k]))
}
