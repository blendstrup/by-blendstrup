"use server"

import { checkHoneypot } from "@/lib/honeypot"
import {
	type PurchaseInquiryData,
	purchaseInquirySchema,
} from "@/lib/schemas/purchase-inquiry"
import { escHtml } from "@/lib/email-utils"
import { createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../keystatic.config"
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
		// pieceTitle deliberately omitted — title is re-verified via Keystatic
		// (see verifiedPieceTitle below) to prevent subject-line spoofing.
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

	const fromAddress =
		process.env.RESEND_FROM_ADDRESS ??
		(process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : undefined)
	if (!fromAddress) {
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	// Re-fetch piece title from Keystatic to avoid trusting the client-submitted
	// hidden field (WR-03 — prevents subject-line spoofing)
	let verifiedPieceTitle: string | undefined
	if (result.data.pieceSlug) {
		const reader = createReader(process.cwd(), keystaticConfig)
		const entry = await reader.collections.works.read(result.data.pieceSlug)
		verifiedPieceTitle = entry?.title ?? undefined
	}

	const { error } = await resend.emails.send({
		from: fromAddress,
		to: recipientEmail,
		subject: `Ny forespørgsel: ${verifiedPieceTitle ?? "Generel forespørgsel"}`,
		html: buildPurchaseEmail(result.data, verifiedPieceTitle),
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

function buildPurchaseEmail(
	data: PurchaseInquiryData,
	verifiedPieceTitle?: string,
): string {
	return `
    <div style="font-family: sans-serif; color: #2C2418; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #A85C3A; margin-bottom: 24px;">Ny forespørgsel</h2>
      ${
			verifiedPieceTitle
				? `
        <p><strong>Stykke:</strong><br>${escHtml(verifiedPieceTitle)}</p>
        <hr style="border-color: #C4A882; margin: 16px 0;" />
      `
				: ""
		}
      <p><strong>Navn:</strong><br>${escHtml(data.name)}</p>
      <p><strong>E-mail:</strong><br><a href="mailto:${escHtml(data.email)}" style="color: #A85C3A;">${escHtml(data.email)}</a></p>
      <p><strong>Besked:</strong><br>${escHtml(data.message)}</p>
    </div>
  `
}
