import assert from 'node:assert'

/**
 * Custom assertion to check if two arrays contain the same members, regardless of order.
 * Replacement for Jest's toIncludeSameMembers matcher.
 *
 * This version compares only the common properties between objects,
 * ignoring methods and other non-serializable properties.
 */
export function assertIncludesSameMembers<T, U>(
  actual: T[],
  expected: U[]
): void {
  // Check if arrays have the same length
  assert.strictEqual(
    actual.length,
    expected.length,
    `Expected array to have ${expected.length} items, but it has ${actual.length} items`
  )

  // Extract serializable properties for comparison
  const actualSerialized = actual.map(item => {
    const obj: Record<string, any> = {}
    for (const key in item) {
      if (
        Object.prototype.hasOwnProperty.call(item, key) &&
        typeof (item as any)[key] !== 'function'
      ) {
        obj[key] = (item as any)[key]
      }
    }
    return obj
  })

  const expectedSerialized = expected.map(item => {
    const obj: Record<string, any> = {}
    for (const key in item) {
      if (
        Object.prototype.hasOwnProperty.call(item, key) &&
        typeof (item as any)[key] !== 'function'
      ) {
        obj[key] = (item as any)[key]
      }
    }
    return obj
  })

  // Check if every item in expected is in actual
  for (const item of expectedSerialized) {
    const matchingItem = actualSerialized.find(actualItem => {
      // Compare all properties that exist in both objects
      for (const key in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, key) &&
          Object.prototype.hasOwnProperty.call(actualItem, key) &&
          JSON.stringify(item[key]) !== JSON.stringify(actualItem[key])
        ) {
          return false
        }
      }
      return true
    })

    assert.ok(
      matchingItem !== undefined,
      `Expected array to include an item with properties ${JSON.stringify(
        item
      )}, but it was not found`
    )
  }
}

/**
 * Utility function to create a test suite
 */
export function describe(name: string, fn: () => void): void {
  // Group tests with a header
  process.stdout.write(`\n# ${name}\n`)
  fn()
}
