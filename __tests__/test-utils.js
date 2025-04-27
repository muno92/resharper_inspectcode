"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIncludesSameMembers = assertIncludesSameMembers;
const node_assert_1 = __importDefault(require("node:assert"));
/**
 * Custom assertion to check if two arrays contain the same members, regardless of order.
 * Replacement for Jest's toIncludeSameMembers matcher.
 *
 * This version compares only the common properties between objects,
 * ignoring methods and other non-serializable properties.
 */
function assertIncludesSameMembers(actual, expected) {
    // Check if arrays have the same length
    node_assert_1.default.strictEqual(actual.length, expected.length, `Expected array to have ${expected.length} items, but it has ${actual.length} items`);
    // Extract serializable properties for comparison
    const actualSerialized = actual.map(item => {
        const obj = {};
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key) &&
                typeof item[key] !== 'function') {
                obj[key] = item[key];
            }
        }
        return obj;
    });
    const expectedSerialized = expected.map(item => {
        const obj = {};
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key) &&
                typeof item[key] !== 'function') {
                obj[key] = item[key];
            }
        }
        return obj;
    });
    // Check if every item in expected is in actual
    for (const item of expectedSerialized) {
        const matchingItem = actualSerialized.find(actualItem => {
            // Compare all properties that exist in both objects
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key) &&
                    Object.prototype.hasOwnProperty.call(actualItem, key) &&
                    JSON.stringify(item[key]) !== JSON.stringify(actualItem[key])) {
                    return false;
                }
            }
            return true;
        });
        node_assert_1.default.ok(matchingItem !== undefined, `Expected array to include an item with properties ${JSON.stringify(item)}, but it was not found`);
    }
}
