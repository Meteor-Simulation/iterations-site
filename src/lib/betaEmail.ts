/** Deliberately loose: this rejects typos, not people with unusual addresses. */
export function isEmail(value: string): boolean {
  const v = value.trim()
  return v.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v)
}
