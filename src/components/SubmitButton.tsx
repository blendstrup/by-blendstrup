"use client"

interface SubmitButtonProps {
	isPending: boolean
	label: string
	pendingLabel: string
	className?: string
}

export function SubmitButton({
	isPending,
	label,
	pendingLabel,
	className,
}: SubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={isPending}
			className={
				className ??
				"cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink disabled:cursor-not-allowed disabled:bg-clay disabled:opacity-60"
			}
		>
			{isPending ? pendingLabel : label}
		</button>
	)
}
