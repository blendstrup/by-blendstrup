"use server"

import { checkHoneypot } from "@/lib/honeypot"
import {
	type CustomOrderFormData,
	customOrderSchema,
} from "@/lib/schemas/custom-order"
import { emailShell, emailField, emailDivider } from "@/lib/email-utils"
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
		(process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : undefined)
	if (!fromAddress) {
		return {
			success: false,
			error: "Noget gik galt. Prøv igen, eller send mig en e-mail direkte.",
		}
	}

	const { error } = await resend.emails.send({
		from: fromAddress,
		to: recipientEmail,
		subject: `Specialbestilling fra ${result.data.name}`,
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
	const subject = `Specialbestilling fra ${data.name}`
	const body = `
    ${emailField("Navn", data.name)}
    ${emailField("E-mail", data.email, { href: `mailto:${data.email}` })}
    ${emailDivider()}
    ${emailField("Hvad ønskes", data.description)}
    ${emailField("Antal", data.quantity)}
    ${data.budget ? emailField("Budget", data.budget) : ""}
    ${data.timeline ? emailField("Ønsket tidslinje", data.timeline) : ""}
  `
	return emailShell(body, subject)
}
