import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateCareersPassword } from "../src/lib/careersPassword";

describe("Careers admin password setup", () => {
  test("requires at least 10 characters", () => {
    assert.notEqual(validateCareersPassword("x".repeat(9), "x".repeat(9)), null);
    assert.equal(validateCareersPassword("x".repeat(10), "x".repeat(10)), null);
  });

  test("requires matching confirmation", () => {
    assert.notEqual(validateCareersPassword("x".repeat(10), "y".repeat(10)), null);
  });
});