import { describe, expect, it } from "vitest"

// The filter logic used in shop page and homepage shop preview
// Works must have BOTH published=true AND saleStatus='available' to appear
function filterAvailableWorks<
	T extends { entry: { published: boolean; saleStatus: string } },
>(works: T[]): T[] {
	return works.filter(
		(w) => w.entry.published && w.entry.saleStatus === "available",
	)
}

const mockWorks = [
	{ slug: "bowl-1", entry: { published: true, saleStatus: "available" } },
	{ slug: "bowl-2", entry: { published: false, saleStatus: "available" } },
	{ slug: "bowl-3", entry: { published: true, saleStatus: "sold" } },
	{ slug: "bowl-4", entry: { published: false, saleStatus: "sold" } },
	{ slug: "bowl-5", entry: { published: true, saleStatus: "notListed" } },
]

describe("filterAvailableWorks", () => {
	it("returns only published + available works", () => {
		const result = filterAvailableWorks(mockWorks)
		expect(result).toHaveLength(1)
		expect(result[0]?.slug).toBe("bowl-1")
	})

	it("excludes unpublished works even if available", () => {
		const result = filterAvailableWorks(mockWorks)
		expect(result.every((w) => w.entry.published)).toBe(true)
	})

	it("excludes sold works even if published", () => {
		const result = filterAvailableWorks(mockWorks)
		expect(result.every((w) => w.entry.saleStatus === "available")).toBe(true)
	})

	it("returns empty array when no available published works", () => {
		const sold = mockWorks.filter((w) => w.entry.saleStatus === "sold")
		expect(filterAvailableWorks(sold)).toHaveLength(0)
	})
})
