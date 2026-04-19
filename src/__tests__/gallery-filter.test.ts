import { describe, expect, it } from "vitest"

// Pure filter functions — these mirror the logic the RSC gallery page will use.
// Tested here against plain objects so no Keystatic Reader mocking is needed.

type WorkEntry = { entry: { published: boolean; saleStatus: string } }

const publishedFilter = (works: WorkEntry[]) =>
	works.filter((w) => w.entry.published)

const forSaleFilter = (works: Array<{ entry: { saleStatus: string } }>) =>
	works.filter((w) => w.entry.saleStatus === "available")

describe("Gallery filter logic", () => {
	describe("publishedFilter", () => {
		it("keeps works where published is true", () => {
			const works: WorkEntry[] = [
				{ entry: { published: true, saleStatus: "available" } },
				{ entry: { published: false, saleStatus: "available" } },
			]
			const result = publishedFilter(works)
			expect(result).toHaveLength(1)
			expect(result[0]?.entry.published).toBe(true)
		})

		it("filters out entries where published is false", () => {
			const works: WorkEntry[] = [
				{ entry: { published: false, saleStatus: "notListed" } },
				{ entry: { published: false, saleStatus: "sold" } },
			]
			const result = publishedFilter(works)
			expect(result).toHaveLength(0)
		})

		it("returns empty array without throwing when given empty input", () => {
			expect(publishedFilter([])).toEqual([])
		})
	})

	describe("forSaleFilter", () => {
		it("keeps only works with saleStatus === 'available'", () => {
			const works = [
				{ entry: { published: true, saleStatus: "available" } },
				{ entry: { published: true, saleStatus: "sold" } },
				{ entry: { published: true, saleStatus: "notListed" } },
			]
			const result = forSaleFilter(works)
			expect(result).toHaveLength(1)
			expect(result[0]?.entry.saleStatus).toBe("available")
		})

		it("excludes sold works from the for-sale filter", () => {
			const works = [{ entry: { published: true, saleStatus: "sold" } }]
			expect(forSaleFilter(works)).toHaveLength(0)
		})

		it("excludes notListed (portfolio-only) works from the for-sale filter", () => {
			const works = [{ entry: { published: true, saleStatus: "notListed" } }]
			expect(forSaleFilter(works)).toHaveLength(0)
		})

		it("returns empty array without throwing when given empty input", () => {
			expect(forSaleFilter([])).toEqual([])
		})
	})

	describe("combined filter (published then for-sale)", () => {
		it("a sold published work passes published filter but not for-sale filter", () => {
			const works: WorkEntry[] = [
				{ entry: { published: true, saleStatus: "sold" } },
			]
			const published = publishedFilter(works)
			expect(published).toHaveLength(1)
			const forSale = forSaleFilter(published)
			expect(forSale).toHaveLength(0)
		})
	})
})
