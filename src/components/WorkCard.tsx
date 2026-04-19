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

export function WorkCard({ slug, entry, labels }: WorkCardProps) {
	return (
		<Link
			href={`/gallery/${slug}`}
			className="group relative block cursor-pointer overflow-hidden border border-clay bg-oat"
		>
			{entry.images.length === 0 ? (
				<div className="relative aspect-[4/5] bg-oat" />
			) : (
				<div className="relative aspect-[4/5] overflow-hidden">
					<Image
						src={entry.images[0]?.image ?? ""}
						alt={entry.images[0]?.alt ?? ""}
						fill
						className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
					<StatusBadge status={entry.saleStatus} labels={labels} />
				</div>
			)}
		</Link>
	)
}
