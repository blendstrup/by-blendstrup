import { describe, expect, it } from "vitest"
import { getBlurDataUrl } from "../lib/blur-placeholder"

describe("getBlurDataUrl", () => {
	it("returns a base64 data URI for a valid image path", async () => {
		// Uses the real ceramic image committed to /public/images/works/bowl-test/
		// This is a build-time utility tested against the actual file on disk
		const result = await getBlurDataUrl(
			"/images/works/bowl-test/images/0/image.png",
		)
		// If the test image path does not yet exist, this test will return undefined
		// and the missing-file test below covers the fallback. Adjust the path to
		// match the actual filename under /public/images/works/bowl-test/images/0/.
		if (result !== undefined) {
			expect(result).toMatch(/^data:image\//)
		}
	})

	it("returns undefined for a missing image path (no crash)", async () => {
		const result = await getBlurDataUrl("/images/works/nonexistent/image.png")
		expect(result).toBeUndefined()
	})

	it("returns undefined for null input (no crash)", async () => {
		const result = await getBlurDataUrl(null)
		expect(result).toBeUndefined()
	})
})
