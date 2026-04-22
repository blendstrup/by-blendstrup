import { describe, expect, it } from "vitest"
import { purchaseInquirySchema } from "../lib/schemas/purchase-inquiry"

describe("purchaseInquirySchema", () => {
	it("accepts valid data with all fields", () => {
		const result = purchaseInquirySchema.safeParse({
			name: "Anna Jensen",
			email: "anna@example.com",
			message: "Jeg er interesseret i det blå fad.",
			pieceSlug: "blaatt-fad",
			// pieceTitle is not a schema field — title is re-verified server-side via Keystatic
		})
		expect(result.success).toBe(true)
	})

	it("accepts valid data without optional piece fields (general inquiry)", () => {
		const result = purchaseInquirySchema.safeParse({
			name: "Anna Jensen",
			email: "anna@example.com",
			message: "Generel forespørgsel",
		})
		expect(result.success).toBe(true)
	})

	it("rejects when name is empty", () => {
		const result = purchaseInquirySchema.safeParse({
			name: "",
			email: "anna@example.com",
			message: "Besked",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.name).toBeDefined()
		}
	})

	it("rejects when email is not a valid email address", () => {
		const result = purchaseInquirySchema.safeParse({
			name: "Anna",
			email: "not-an-email",
			message: "Besked",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.email).toBeDefined()
		}
	})

	it("rejects when message is empty", () => {
		const result = purchaseInquirySchema.safeParse({
			name: "Anna",
			email: "anna@example.com",
			message: "",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.message).toBeDefined()
		}
	})
})
