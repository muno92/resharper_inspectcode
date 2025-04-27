import assert from 'assert/strict'

/**
 * Custom assertion to check if two arrays include the same members,
 * regardless of order.
 */
export function assertIncludeSameMembers<T>(actual: T[], expected: T[]): void {
  assert.equal(
    actual.length,
    expected.length,
    `Expected arrays to have the same length. Actual: ${actual.length}, Expected: ${expected.length}`
  )

  // Check that every item in actual has a match in expected
  for (const item of actual) {
    const matchInExpected = expected.some((expectedItem) => 
      JSON.stringify(expectedItem) === JSON.stringify(item)
    )
    
    assert.ok(
      matchInExpected, 
      `Expected ${JSON.stringify(item)} to be in the expected array but it was not found`
    )
  }
}