import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { StatusBadge } from "./StatusBadge"

export interface WorkCardEntry {
	titleDa: string
	titleEn: string
	saleStatus: "available" | "sold" | "notListed"
	images: ReadonlyArray<{ readonly image: string | null; readonly alt: string }>
}

interface WorkCardProps {
	slug: string
	entry: WorkCardEntry
	locale: string
	labels: { sold: string; forSale: string }
}

export function WorkCard({ slug, entry, locale, labels }: WorkCardProps) {
	const title = locale === "da" ? entry.titleDa : entry.titleEn

	return (
		<Link
			href={`/gallery/${slug}`}
			className="group relative block cursor-pointer overflow-hidden rounded-2xl"
		>
			<div className="relative aspect-[4/5]">
				{entry.images.length === 0 ? (
					<div className="absolute inset-0 bg-clay/30" />
				) : (
					<Image
						src={entry.images[0]?.image ?? ""}
						alt={entry.images[0]?.alt ?? ""}
						fill
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				)}
				{/* Gradient scrim for text readability */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/60 to-transparent" />
				{/* Title + status overlay */}
				<div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
					<p className="font-medium font-sans text-linen text-sm leading-snug">
						{title}
					</p>
					<StatusBadge status={entry.saleStatus} labels={labels} />
				</div>
			</div>
		</Link>
	)
}
