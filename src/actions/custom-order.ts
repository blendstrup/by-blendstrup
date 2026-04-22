"use server"

import { escHtml } from "@/lib/email-utils"
import { checkHoneypot } from "@/lib/honeypot"
import {
	type CustomOrderFormData,
	customOrderSchema,
} from "@/lib/schemas/custom-order"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export type ActionState = {
	success: boolean
	error?: string
	fieldErrors?: Record<string, string[]>
}

export async function submitCustomOrder(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	// Honeypot check — silent discard, fake success (D-06, CUST-03)
	if (checkHoneypot(formData.get("website"))) {
		return { success: true }
	}

	const raw = {
		name: formData.get("name"),
		email: formData.get("email"),
		description: formData.get("description"),
		quantity: formData.get("quantity"),
		budget: formData.get("budget") || undefined,
		timeline: formData.get("timeline") || undefined,
	}

	const result = customOrderSchema.safeParse(raw)
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
		(process.env.NODE_ENV === "development"
			? "onboarding@resend.dev"
			: undefined)
	if (!fromAddress) {
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	const { error } = await resend.emails.send({
		from: fromAddress,
		to: recipientEmail,
		subject: `Ny specialbestilling fra ${result.data.name}`,
		html: buildCustomOrderEmail(result.data),
	})

	if (error) {
		// Never expose Resend error details to client — generic Danish message only (T-5-03-03)
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	return { success: true }
}

function buildCustomOrderEmail(data: CustomOrderFormData): string {
	return `
    <div style="font-family: sans-serif; color: #2C2418; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #A85C3A; margin-bottom: 24px;">Ny specialbestilling</h2>
      <p><strong>Navn:</strong><br>${escHtml(data.name)}</p>
      <p><strong>E-mail:</strong><br><a href="mailto:${escHtml(data.email)}" style="color: #A85C3A;">${escHtml(data.email)}</a></p>
      <hr style="border-color: #C4A882; margin: 16px 0;" />
      <p><strong>Hvad ønskes:</strong><br>${escHtml(data.description)}</p>
      <p><strong>Antal:</strong><br>${escHtml(data.quantity)}</p>
      ${data.budget ? `<p><strong>Budget:</strong><br>${escHtml(data.budget)}</p>` : ""}
      ${data.timeline ? `<p><strong>Ønsket tidslinje:</strong><br>${escHtml(data.timeline)}</p>` : ""}
    </div>
  `
}
