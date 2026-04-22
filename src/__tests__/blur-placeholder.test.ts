import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import path from "node:path"
import { getBlurDataUrl } from "../lib/blur-placeholder"

const FIXTURE = "/images/works/bowl-test/images/0/image.png"
const fixtureExists = existsSync(path.join(process.cwd(), "public", FIXTURE))

describe.skipIf(!fixtureExists)("getBlurDataUrl — fixture tests", () => {
	it("returns a base64 data URI for a valid image path", async () => {
		// Uses the real ceramic image committed to /public/images/works/bowl-test/
		// This is a build-time utility tested against the actual file on disk
		const result = await getBlurDataUrl(FIXTURE)
		expect(result).toMatch(/^data:image\//)
	})
})

describe("getBlurDataUrl", () => {

	it("returns undefined for a missing image path (no crash)", async () => {
		const result = await getBlurDataUrl("/images/works/nonexistent/image.png")
		expect(result).toBeUndefined()
	})

	it("returns undefined for null input (no crash)", async () => {
		const result = await getBlurDataUrl(null)
		expect(result).toBeUndefined()
	})
})
