import Image from "next/image"
import Link from "next/link"

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
}

export function ShopCard({ slug, entry, labels }: ShopCardProps) {
	return (
		<div className="group relative overflow-hidden rounded-2xl">
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

				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-ink/75 to-transparent" />

				<div className="absolute inset-x-0 bottom-0 p-4">
					<p className="font-medium font-sans text-linen text-sm leading-snug">
						{entry.title}
					</p>
					{entry.price ? (
						<p className="mt-0.5 font-medium font-sans text-linen/90 text-sm leading-snug">
							{entry.price}
						</p>
					) : null}
					{entry.leadTime ? (
						<p className="font-sans text-linen/70 text-xs leading-snug">
							{entry.leadTime}
						</p>
					) : null}
				</div>

				<div className="absolute inset-0 hidden items-center justify-center bg-ink/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
					<Link
						href={`/contact/purchase?piece=${slug}`}
						className="cursor-pointer bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
					>
						{labels.contactToBuy}
					</Link>
				</div>
			</div>

			<div className="sm:hidden">
				<Link
					href={`/contact/purchase?piece=${slug}`}
					className="block w-full cursor-pointer bg-terracotta px-6 py-3 text-center font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
				>
					{labels.contactToBuy}
				</Link>
			</div>
		</div>
	)
}
