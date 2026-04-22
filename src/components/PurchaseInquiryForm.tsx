"use client"

import {
	type ActionState,
	submitPurchaseInquiry,
} from "@/actions/purchase-inquiry"
import { SubmitButton } from "@/components/SubmitButton"
import {
	type PurchaseInquiryData,
	purchaseInquirySchema,
} from "@/lib/schemas/purchase-inquiry"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState } from "react"
import { useForm } from "react-hook-form"
import da from "../../messages/da.json"

interface PurchaseInquiryFormProps {
	pieceSlug?: string
	pieceTitle?: string
}

const initialState: ActionState = { success: false }

export function PurchaseInquiryForm({
	pieceSlug,
	pieceTitle,
}: PurchaseInquiryFormProps) {
	const [state, formAction, isPending] = useActionState(
		submitPurchaseInquiry,
		initialState,
	)

	const {
		register,
		formState: { errors },
	} = useForm<PurchaseInquiryData>({
		resolver: zodResolver(purchaseInquirySchema),
	})

	if (state.success) {
		return (
			<div className="py-12 text-center">
				<p className="mb-4 font-normal font-serif text-[28px] text-ink tracking-tight">
					{da.contact.purchase.form.successHeading}
				</p>
				<p className="font-normal font-sans text-base text-stone">
					{da.contact.purchase.form.successBody}
				</p>
			</div>
		)
	}

	return (
		<form action={formAction} className="flex flex-col gap-8" noValidate>
			{/* Honeypot — off-screen, hidden from assistive tech, visible to bots (D-06, T-5-02-01) */}
			<input
				type="text"
				name="website"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				className="-left-[9999px] pointer-events-none absolute opacity-0"
			/>

			{/* Hidden piece reference fields (D-03) */}
			<input type="hidden" name="pieceSlug" value={pieceSlug ?? ""} />
			<input type="hidden" name="pieceTitle" value={pieceTitle ?? ""} />

			{/* Read-only "Regarding" panel — only shown when pieceTitle is present (D-03) */}
			{pieceTitle && (
				<div className="flex flex-col gap-2">
					<p className="font-medium font-sans text-sm text-stone">
						{da.contact.purchase.form.regardingLabel}
					</p>
					<div className="w-full overflow-hidden rounded-sm border border-clay bg-oat px-4 py-3 font-medium font-sans text-base text-ink">
						{pieceTitle}
					</div>
				</div>
			)}

			{/* Name field */}
			<div className="flex flex-col gap-2">
				<label
					htmlFor="name"
					className="font-medium font-sans text-ink text-sm"
				>
					{da.contact.purchase.form.nameLabel}
				</label>
				<input
					id="name"
					type="text"
					autoComplete="name"
					{...register("name")}
					className="w-full overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"
					aria-invalid={errors.name ? "true" : undefined}
				/>
				{errors.name && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{errors.name.message ?? da.contact.purchase.form.validationRequired}
					</p>
				)}
				{state.fieldErrors?.name && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{state.fieldErrors.name[0]}
					</p>
				)}
			</div>

			{/* Email field */}
			<div className="flex flex-col gap-2">
				<label
					htmlFor="email"
					className="font-medium font-sans text-ink text-sm"
				>
					{da.contact.purchase.form.emailLabel}
				</label>
				<input
					id="email"
					type="email"
					autoComplete="email"
					{...register("email")}
					className="w-full overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"
					aria-invalid={errors.email ? "true" : undefined}
				/>
				{errors.email && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{errors.email.message ?? da.contact.purchase.form.validationEmail}
					</p>
				)}
				{state.fieldErrors?.email && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{state.fieldErrors.email[0]}
					</p>
				)}
			</div>

			{/* Message field */}
			<div className="flex flex-col gap-2">
				<label
					htmlFor="message"
					className="font-medium font-sans text-ink text-sm"
				>
					{da.contact.purchase.form.messageLabel}
				</label>
				<textarea
					id="message"
					rows={5}
					{...register("message")}
					placeholder={da.contact.purchase.form.messagePlaceholder}
					className="min-h-[120px] w-full resize-y overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"
					aria-invalid={errors.message ? "true" : undefined}
				/>
				{errors.message && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{errors.message.message ??
							da.contact.purchase.form.validationRequired}
					</p>
				)}
				{state.fieldErrors?.message && (
					<p
						role="alert"
						className="mt-1 font-normal font-sans text-fault text-sm"
					>
						{state.fieldErrors.message[0]}
					</p>
				)}
			</div>

			{/* Submission error banner */}
			{state.error && (
				<p
					role="alert"
					aria-live="polite"
					className="border border-fault/30 bg-fault/10 px-4 py-3 font-normal font-sans text-fault text-sm"
				>
					{state.error}
				</p>
			)}

			<div className="mt-8">
				<SubmitButton
					isPending={isPending}
					label={da.contact.purchase.form.submit}
					pendingLabel={da.contact.purchase.form.submitting}
				/>
			</div>
		</form>
	)
}
