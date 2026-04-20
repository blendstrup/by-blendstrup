// src/lib/schemas/custom-order.ts
// No directive — shared between server action and client component
import { z } from "zod"

export const customOrderSchema = z.object({
	name: z.string().min(1, "Dette felt er påkrævet"),
	email: z.string().email("Indtast en gyldig e-mailadresse"),
	description: z
		.string()
		.min(10, "Beskriv venligst hvad du ønsker (mindst 10 tegn)"),
	quantity: z.string().min(1, "Dette felt er påkrævet"),
	budget: z.string().optional(),
	timeline: z.string().optional(),
})

export type CustomOrderFormData = z.infer<typeof customOrderSchema>
