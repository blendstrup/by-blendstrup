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

describe("i18n message keys — Phase 4 additions", () => {
	type DeepMessages = Record<string, unknown>

	function getKey(obj: DeepMessages, path: string): unknown {
		return path.split(".").reduce((acc: unknown, key) => {
			if (acc && typeof acc === "object") return (acc as DeepMessages)[key]
			return undefined
		}, obj)
	}

	const phase4Keys = [
		"navigation.shop",
		"navigation.contact",
		"home.hero.scrollIndicator",
		"home.shopPreview.heading",
		"home.shopPreview.viewAll",
		"home.shopPreview.empty",
		"home.about.heading",
		"home.customOrders.heading",
		"home.customOrders.body",
		"home.customOrders.cta",
		"shop.heading",
		"shop.empty.heading",
		"shop.empty.body",
		"shop.card.contactToBuy",
		"contact.heading",
		"contact.info.heading",
		"contact.purchase.heading",
		"contact.purchase.body",
		"contact.purchase.cta",
		"contact.customOrders.heading",
		"contact.customOrders.body",
		"contact.customOrders.cta",
	]

	describe("English messages (Phase 4 keys)", () => {
		for (const key of phase4Keys) {
			it(`has ${key}`, () => {
				expect(getKey(en as unknown as DeepMessages, key)).toBeDefined()
			})
		}
	})

	describe("Danish messages (Phase 4 keys)", () => {
		for (const key of phase4Keys) {
			it(`has ${key}`, () => {
				expect(getKey(da as unknown as DeepMessages, key)).toBeDefined()
			})
		}
	})
})
