interface StatusBadgeProps {
	status: "available" | "sold" | "notListed"
	labels: { sold: string; forSale: string }
}

export function StatusBadge({ status, labels }: StatusBadgeProps) {
	if (status === "notListed") {
		return null
	}

	const isSold = status === "sold"
	const label = isSold ? labels.sold : labels.forSale
	const colorClass = isSold ? "bg-stone" : "bg-terracotta"

	return (
		<span
			aria-label={label}
			className={`absolute top-2 left-2 rounded-full px-2 py-1 font-medium text-linen text-sm ${colorClass}`}
		>
			{label}
		</span>
	)
}
