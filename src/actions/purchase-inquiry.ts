"use server"

import { checkHoneypot } from "@/lib/honeypot"
import {
	type PurchaseInquiryData,
	purchaseInquirySchema,
} from "@/lib/schemas/purchase-inquiry"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export type ActionState = {
	success: boolean
	error?: string
	fieldErrors?: Record<string, string[]>
}

export async function submitPurchaseInquiry(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	// Honeypot check — silent discard, fake success (D-06)
	if (checkHoneypot(formData.get("website"))) {
		return { success: true }
	}

	const raw = {
		name: formData.get("name"),
		email: formData.get("email"),
		message: formData.get("message"),
		pieceSlug: formData.get("pieceSlug") || undefined,
		pieceTitle: formData.get("pieceTitle") || undefined,
	}

	const result = purchaseInquirySchema.safeParse(raw)
	if (!result.success) {
		return {
			success: false,
			fieldErrors: result.error.flatten().fieldErrors as Record<
				string,
				string[]
			>,
		}
	}

	const recipientEmail = process.env.RECIPIENT_EMAIL ?? ""
	if (!recipientEmail) {
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	const { error } = await resend.emails.send({
		// Development: use onboarding@resend.dev — replace with noreply@[owner-domain] after DNS setup (D-11)
		from: process.env.RESEND_FROM_ADDRESS ?? "onboarding@resend.dev",
		to: recipientEmail,
		subject: `Ny forespørgsel: ${result.data.pieceTitle ?? "Generel forespørgsel"}`,
		html: buildPurchaseEmail(result.data),
	})

	if (error) {
		// Never expose Resend error details to client — generic Danish message only (T-5-02-03)
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	return { success: true }
}

function buildPurchaseEmail(data: PurchaseInquiryData): string {
	return `
    <div style="font-family: sans-serif; color: #2C2418; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #A85C3A; margin-bottom: 24px;">Ny forespørgsel</h2>
      ${
				data.pieceTitle
					? `
        <p><strong>Stykke:</strong><br>${data.pieceTitle}</p>
        <hr style="border-color: #C4A882; margin: 16px 0;" />
      `
					: ""
			}
      <p><strong>Navn:</strong><br>${data.name}</p>
      <p><strong>E-mail:</strong><br><a href="mailto:${data.email}" style="color: #A85C3A;">${data.email}</a></p>
      <p><strong>Besked:</strong><br>${data.message}</p>
    </div>
  `
}
