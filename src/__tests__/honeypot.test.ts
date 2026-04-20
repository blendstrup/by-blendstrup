import { describe, expect, it } from "vitest"
import { checkHoneypot } from "../lib/honeypot"

describe("checkHoneypot (CUST-03)", () => {
	it("returns false when value is empty string — legitimate user", () => {
		expect(checkHoneypot("")).toBe(false)
	})

	it("returns false when value is undefined — field not submitted", () => {
		expect(checkHoneypot(undefined)).toBe(false)
	})

	it("returns false when value is null — field not submitted", () => {
		expect(checkHoneypot(null)).toBe(false)
	})

	it("returns false when value is whitespace-only — treated as empty", () => {
		expect(checkHoneypot("   ")).toBe(false)
	})

	it("returns true when value is a URL — bot filled the field", () => {
		expect(checkHoneypot("http://spam.com")).toBe(true)
	})

	it("returns true when value is any non-empty text — bot filled the field", () => {
		expect(checkHoneypot("anytext")).toBe(true)
	})
})
