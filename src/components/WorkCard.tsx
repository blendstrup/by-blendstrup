import Image from "next/image"
import Link from "next/link"
import { StatusBadge } from "./StatusBadge"

export interface WorkCardEntry {
	title: string
	saleStatus: "available" | "sold" | "notListed"
	images: ReadonlyArray<{ readonly image: string | null; readonly alt: string }>
	video?: string | null
}

interface WorkCardProps {
	slug: string
	entry: WorkCardEntry
	labels: { sold: string; forSale: string }
	blurDataUrl?: string
}

export function WorkCard({ slug, entry, labels, blurDataUrl }: WorkCardProps) {
	return (
		<Link
			href={`/gallery/${slug}`}
			className="group relative block cursor-pointer overflow-hidden rounded-2xl"
		>
			<div className="relative aspect-4/5">
				{entry.video ? (
					<video
						src={entry.video}
						autoPlay
						muted
						loop
						playsInline
						className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
						aria-label={entry.images[0]?.alt ?? entry.title}
					/>
				) : entry.images.length === 0 ? (
					<div className="absolute inset-0 bg-clay/30" />
				) : (
					<Image
						src={entry.images[0]?.image ?? ""}
						alt={entry.images[0]?.alt ?? ""}
						fill
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						placeholder={blurDataUrl ? "blur" : "empty"}
						blurDataURL={blurDataUrl}
					/>
				)}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-ink/60 to-transparent" />
				<StatusBadge status={entry.saleStatus} labels={labels} />

				<div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-4">
					<p className="font-medium font-sans text-linen text-sm leading-snug">
						{entry.title}
					</p>
				</div>
			</div>
		</Link>
	)
}
