import Image from "next/image"
import Link from "next/link"
import { StatusBadge } from "./StatusBadge"

export interface ShopCardEntry {
	title: string
	price: string
	leadTime: string
	saleStatus: "available" | "sold" | "notListed"
	images: ReadonlyArray<{ readonly image: string | null; readonly alt: string }>
}

interface ShopCardProps {
	slug: string
	entry: ShopCardEntry
	labels: {
		sold: string
		forSale: string
		contactToBuy: string
	}
	blurDataUrl?: string
}

export function ShopCard({ slug, entry, labels, blurDataUrl }: ShopCardProps) {
	return (
		<div className="group relative overflow-hidden rounded-2xl">
			{/* Entire image area navigates to the detail page */}
			<Link href={`/gallery/${slug}`} className="block">
				<div className="relative aspect-4/5">
					{entry.images.length === 0 ? (
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

					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-t from-ink/75 to-transparent" />

					<StatusBadge status={entry.saleStatus} labels={labels} />

					<div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-4">
						<p className="font-medium font-sans text-linen text-sm leading-snug">
							{entry.title}
						</p>
						{entry.price ? (
							<p className="font-medium font-sans text-linen/90 text-sm leading-snug">
								{entry.price}
							</p>
						) : null}
						{entry.leadTime ? (
							<p className="font-sans text-linen/70 text-xs leading-snug">
								{entry.leadTime}
							</p>
						) : null}
					</div>
				</div>
			</Link>

			{/* Desktop hover overlay — pointer-events-none so card link still works;
			    only the buy button inside re-enables pointer events */}
			{entry.saleStatus === "available" && (
				<div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-ink/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
					<Link
						href={`/contact/purchase?piece=${slug}`}
						className="pointer-events-auto cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
					>
						{labels.contactToBuy}
					</Link>
				</div>
			)}

			{entry.saleStatus === "available" && (
				<div className="sm:hidden">
					<Link
						href={`/contact/purchase?piece=${slug}`}
						className="block w-full cursor-pointer rounded-sm bg-terracotta px-6 py-3 text-center font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
					>
						{labels.contactToBuy}
					</Link>
				</div>
			)}
		</div>
	)
}
