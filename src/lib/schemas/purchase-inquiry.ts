// src/lib/schemas/purchase-inquiry.ts
// No directive — shared between server action and client component
import { z } from "zod"

export const purchaseInquirySchema = z.object({
	name: z.string().min(1, "Dette felt er påkrævet"),
	email: z.string().email("Indtast en gyldig e-mailadresse"),
	message: z.string().min(1, "Dette felt er påkrævet"),
	pieceSlug: z.string().optional(),
	// pieceTitle is intentionally absent — the piece title is always re-fetched
	// from Keystatic via pieceSlug (see submitPurchaseInquiry) to prevent
	// subject-line spoofing from a client-supplied hidden field.
})

export type PurchaseInquiryData = z.infer<typeof purchaseInquirySchema>
