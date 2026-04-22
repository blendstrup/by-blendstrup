"use client"

import { type ActionState, submitCustomOrder } from "@/actions/custom-order"
import { SubmitButton } from "@/components/SubmitButton"
import {
	type CustomOrderFormData,
	customOrderSchema,
} from "@/lib/schemas/custom-order"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState } from "react"
import { useForm } from "react-hook-form"
import da from "../../messages/da.json"

const initialState: ActionState = { success: false }

const inputClass =
	"w-full overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"

const labelClass = "font-medium font-sans text-ink text-sm"

const errorClass = "mt-1 font-normal font-sans text-fault text-sm"

export function CustomOrderForm() {
	const [state, formAction, isPending] = useActionState(
		submitCustomOrder,
		initialState,
	)

	const {
		register,
		formState: { errors },
	} = useForm<CustomOrderFormData>({
		resolver: zodResolver(customOrderSchema),
	})

	if (state.success) {
		return (
			<div className="py-12 text-center">
				<p className="mb-4 font-normal font-serif text-[28px] text-ink tracking-tight">
					{da.contact.customOrders.form.successHeading}
				</p>
				<p className="font-normal font-sans text-base text-stone">
					{da.contact.customOrders.form.successBody}
				</p>
			</div>
		)
	}

	return (
		<form action={formAction} className="flex flex-col gap-8" noValidate>
			{/* Honeypot — off-screen, hidden from assistive tech, visible to bots (D-06, CUST-03) */}
			<input
				type="text"
				name="website"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				className="-left-[9999px] pointer-events-none absolute opacity-0"
			/>

			{/* Name */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-name" className={labelClass}>
					{da.contact.customOrders.form.nameLabel}
				</label>
				<input
					id="co-name"
					type="text"
					autoComplete="name"
					{...register("name")}
					className={inputClass}
					aria-invalid={errors.name ? "true" : undefined}
				/>
				{errors.name && (
					<p role="alert" className={errorClass}>
						{errors.name.message ??
							da.contact.customOrders.form.validationRequired}
					</p>
				)}
				{state.fieldErrors?.name && (
					<p role="alert" className={errorClass}>
						{state.fieldErrors.name[0]}
					</p>
				)}
			</div>

			{/* Email */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-email" className={labelClass}>
					{da.contact.customOrders.form.emailLabel}
				</label>
				<input
					id="co-email"
					type="email"
					autoComplete="email"
					{...register("email")}
					className={inputClass}
					aria-invalid={errors.email ? "true" : undefined}
				/>
				{errors.email && (
					<p role="alert" className={errorClass}>
						{errors.email.message ??
							da.contact.customOrders.form.validationEmail}
					</p>
				)}
				{state.fieldErrors?.email && (
					<p role="alert" className={errorClass}>
						{state.fieldErrors.email[0]}
					</p>
				)}
			</div>

			{/* What do you want */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-description" className={labelClass}>
					{da.contact.customOrders.form.whatLabel}
				</label>
				<textarea
					id="co-description"
					rows={5}
					{...register("description")}
					placeholder={da.contact.customOrders.form.descriptionPlaceholder}
					className={`${inputClass} min-h-[120px] resize-y`}
					aria-invalid={errors.description ? "true" : undefined}
				/>
				{errors.description && (
					<p role="alert" className={errorClass}>
						{errors.description.message ??
							da.contact.customOrders.form.validationRequired}
					</p>
				)}
				{state.fieldErrors?.description && (
					<p role="alert" className={errorClass}>
						{state.fieldErrors.description[0]}
					</p>
				)}
			</div>

			{/* Quantity */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-quantity" className={labelClass}>
					{da.contact.customOrders.form.quantityLabel}
				</label>
				<input
					id="co-quantity"
					type="text"
					inputMode="numeric"
					{...register("quantity")}
					placeholder={da.contact.customOrders.form.quantityPlaceholder}
					className={inputClass}
					aria-invalid={errors.quantity ? "true" : undefined}
				/>
				{errors.quantity && (
					<p role="alert" className={errorClass}>
						{errors.quantity.message ??
							da.contact.customOrders.form.validationRequired}
					</p>
				)}
				{state.fieldErrors?.quantity && (
					<p role="alert" className={errorClass}>
						{state.fieldErrors.quantity[0]}
					</p>
				)}
			</div>

			{/* Budget — optional (CUST-02) */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-budget" className={labelClass}>
					{da.contact.customOrders.form.budgetLabel}{" "}
					<span className="font-normal text-stone">
						{da.contact.customOrders.form.budgetOptional}
					</span>
				</label>
				<input
					id="co-budget"
					type="text"
					{...register("budget")}
					placeholder={da.contact.customOrders.form.budgetPlaceholder}
					className={inputClass}
				/>
			</div>

			{/* Timeline — optional (CUST-02) */}
			<div className="flex flex-col gap-2">
				<label htmlFor="co-timeline" className={labelClass}>
					{da.contact.customOrders.form.timelineLabel}{" "}
					<span className="font-normal text-stone">
						{da.contact.customOrders.form.timelineOptional}
					</span>
				</label>
				<input
					id="co-timeline"
					type="text"
					{...register("timeline")}
					placeholder={da.contact.customOrders.form.timelinePlaceholder}
					className={inputClass}
				/>
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
					label={da.contact.customOrders.form.submit}
					pendingLabel={da.contact.customOrders.form.submitting}
				/>
			</div>
		</form>
	)
}
