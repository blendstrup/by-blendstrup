import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { StatusBadge } from "./StatusBadge"

export interface ShopCardEntry {
	titleDa: string
	titleEn: string
	price: string
	leadTime: string
	saleStatus: "available" | "sold" | "notListed"
	images: ReadonlyArray<{ readonly image: string | null; readonly alt: string }>
}

interface ShopCardProps {
	slug: string
	entry: ShopCardEntry
	locale: string
	labels: {
		sold: string
		forSale: string
		contactToBuy: string
	}
}

export function ShopCard({ slug, entry, locale, labels }: ShopCardProps) {
	const title = locale === "da" ? entry.titleDa : entry.titleEn
	const ctaHref = "/contact" as const

	return (
		<div className="group relative block overflow-hidden border border-clay bg-oat">
			{/* Image + overlay wrapper */}
			<div className="relative aspect-[4/5] overflow-hidden">
				{entry.images.length === 0 ? (
					<div className="absolute inset-0 bg-oat" />
				) : (
					<Image
						src={entry.images[0]?.image ?? ""}
						alt={entry.images[0]?.alt ?? ""}
						fill
						className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				)}

				{/* StatusBadge — top-left corner (always available on shop page, retained for consistency) */}
				<StatusBadge status={entry.saleStatus} labels={labels} />

				{/* Price + lead time overlay scrim — always visible */}
				<div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-ink/70 to-transparent p-4 flex flex-col justify-end gap-1">
					{entry.price ? (
						<span className="font-sans text-sm font-medium text-linen leading-snug">
							{entry.price}
						</span>
					) : null}
					{entry.leadTime ? (
						<span className="font-sans text-sm font-medium text-linen/80 leading-snug">
							{entry.leadTime}
						</span>
					) : null}
				</div>

				{/* Desktop hover CTA — hidden on mobile, opacity-0 at rest, fades in on group-hover */}
				<div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<Link
						href={ctaHref}
						className="bg-terracotta text-linen font-sans text-sm font-medium px-6 py-3 cursor-pointer transition-colors duration-150 hover:bg-stone active:bg-ink focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2"
					>
						{labels.contactToBuy}
					</Link>
				</div>
			</div>

			{/* Mobile always-visible CTA — hidden on desktop (sm+) */}
			<div className="sm:hidden w-full">
				<Link
					href={ctaHref}
					className="block w-full bg-terracotta text-linen font-sans text-sm font-medium px-6 py-3 text-center cursor-pointer transition-colors duration-150 hover:bg-stone active:bg-ink focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2"
				>
					{labels.contactToBuy}
				</Link>
			</div>

			{/* Card title — below mobile CTA on mobile, below image area on desktop */}
			<p className="px-3 py-2 font-sans text-ink text-sm font-medium">{title}</p>
		</div>
	)
}
