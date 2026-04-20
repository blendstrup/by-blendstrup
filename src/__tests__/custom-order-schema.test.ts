import { describe, expect, it } from "vitest"
import { customOrderSchema } from "../lib/schemas/custom-order"

describe("customOrderSchema", () => {
	it("accepts valid data with all required fields and no optional fields (CUST-02)", () => {
		const result = customOrderSchema.safeParse({
			name: "Lars Petersen",
			email: "lars@example.com",
			description: "En stor skål til frugt, gerne i en varm terracotta farve.",
			quantity: "2",
		})
		expect(result.success).toBe(true)
	})

	it("accepts valid data with optional budget and timeline fields present (CUST-02)", () => {
		const result = customOrderSchema.safeParse({
			name: "Lars Petersen",
			email: "lars@example.com",
			description: "En stor skål til frugt, gerne i en varm terracotta farve.",
			quantity: "2",
			budget: "500-1000 kr.",
			timeline: "Inden jul",
		})
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.budget).toBe("500-1000 kr.")
			expect(result.data.timeline).toBe("Inden jul")
		}
	})

	it("rejects when name is empty (CUST-01)", () => {
		const result = customOrderSchema.safeParse({
			name: "",
			email: "lars@example.com",
			description: "En stor skål til frugt, gerne i en varm terracotta farve.",
			quantity: "1",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.name).toBeDefined()
		}
	})

	it("rejects when email is invalid (CUST-01)", () => {
		const result = customOrderSchema.safeParse({
			name: "Lars",
			email: "invalid",
			description: "En stor skål til frugt, gerne i en varm terracotta farve.",
			quantity: "1",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.email).toBeDefined()
		}
	})

	it("rejects when description is fewer than 10 characters (CUST-01)", () => {
		const result = customOrderSchema.safeParse({
			name: "Lars",
			email: "lars@example.com",
			description: "Kort",
			quantity: "1",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.description).toBeDefined()
		}
	})

	it("rejects when quantity is empty (CUST-01)", () => {
		const result = customOrderSchema.safeParse({
			name: "Lars",
			email: "lars@example.com",
			description: "En stor skål til frugt, gerne i en varm terracotta farve.",
			quantity: "",
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.quantity).toBeDefined()
		}
	})
})
