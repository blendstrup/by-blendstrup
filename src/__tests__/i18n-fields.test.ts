import { describe, expect, it } from "vitest"
import da from "../../messages/da.json"
import en from "../../messages/en.json"

type Messages = Record<string, Record<string, Record<string, string>>>

describe("i18n message keys — shop namespace", () => {
	describe("English messages", () => {
		it("has shop.saleStatus.available", () => {
			expect(
				(en as unknown as Messages).shop?.saleStatus?.available,
			).toBeDefined()
		})
		it("has shop.saleStatus.sold", () => {
			expect((en as unknown as Messages).shop?.saleStatus?.sold).toBeDefined()
		})
		it("has shop.saleStatus.notListed", () => {
			expect(
				(en as unknown as Messages).shop?.saleStatus?.notListed,
			).toBeDefined()
		})
	})

	describe("Danish messages", () => {
		it("has shop.saleStatus.available", () => {
			expect(
				(da as unknown as Messages).shop?.saleStatus?.available,
			).toBeDefined()
		})
		it("has shop.saleStatus.sold", () => {
			expect((da as unknown as Messages).shop?.saleStatus?.sold).toBeDefined()
		})
		it("has shop.saleStatus.notListed", () => {
			expect(
				(da as unknown as Messages).shop?.saleStatus?.notListed,
			).toBeDefined()
		})
	})
})

type FlatMessages = Record<string, Record<string, string>>

describe("i18n message keys — gallery namespace", () => {
	const galleryKeys = [
		"title",
		"filterAll",
		"filterForSale",
		"soldLabel",
		"forSaleLabel",
		"contactToBuy",
		"soldMessage",
		"soldCta",
		"emptyAllHeading",
		"emptyAllBody",
		"emptyForSaleHeading",
		"emptyForSaleBody",
		"emptyForSaleCta",
	]

	describe("English messages", () => {
		for (const key of galleryKeys) {
			it(`has gallery.${key}`, () => {
				expect((en as unknown as FlatMessages).gallery?.[key]).toBeDefined()
			})
		}
	})

	describe("Danish messages", () => {
		for (const key of galleryKeys) {
			it(`has gallery.${key}`, () => {
				expect((da as unknown as FlatMessages).gallery?.[key]).toBeDefined()
			})
		}
	})
})
