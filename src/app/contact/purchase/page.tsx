import { PurchaseInquiryForm } from "@/components/PurchaseInquiryForm"
import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import type { Metadata } from "next"
import Image from "next/image"
import keystaticConfig from "../../../../keystatic.config"
import da from "../../../../messages/da.json"

export const metadata: Metadata = {
	...baseMetadata,
	title: "Købsforespørgsel",
	description:
		"Send en forespørgsel om køb af et keramikstykke fra By Blendstrup.",
	openGraph: {
		...baseMetadata.openGraph,
		title: "Købsforespørgsel — By Blendstrup",
		description:
			"Send en forespørgsel om køb af et keramikstykke fra By Blendstrup.",
	},
}

interface Props {
	searchParams: Promise<{ piece?: string }>
}

export default async function PurchaseInquiryPage({ searchParams }: Props) {
	// CRITICAL: await searchParams — Next.js 15 makes searchParams a Promise (Pitfall 1)
	const { piece: slug } = await searchParams

	let pieceTitle: string | undefined
	let pieceEntry: {
		title: string
		firstImage: string | null
		firstImageAlt: string
		price: string | null
	} | null = null

	if (slug) {
		const reader = createReader(process.cwd(), keystaticConfig)
		const entry = await reader.collections.works.read(slug)
		if (entry) {
			// Image path comes from Keystatic (server-side trusted source) — T-un8-03-02
			const images = entry.images as Array<{ image: string | null; alt: string }>
			pieceEntry = {
				title: entry.title,
				firstImage: images[0]?.image ?? null,
				firstImageAlt: images[0]?.alt ?? entry.title,
				price: entry.price ?? null,
			}
			pieceTitle = entry.title // keep for form prop
		}
	}

	return (
		<main className="py-16 lg:py-24">
			<div className="mx-auto max-w-screen-lg px-6 sm:px-12 lg:px-16">
				<h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
					{da.contact.purchase.form.heading}
				</h1>
				{slug && pieceEntry ? (
					// Two-column layout when item is known
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
						{/* Left: item preview card */}
						<div className="flex flex-col gap-4">
							{pieceEntry.firstImage && (
								<div className="relative aspect-[4/5] overflow-hidden border border-clay bg-oat">
									<Image
										src={pieceEntry.firstImage}
										alt={pieceEntry.firstImageAlt}
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 40vw"
									/>
								</div>
							)}
							<div>
								<p className="font-normal font-serif text-[22px] text-ink tracking-tight">
									{pieceEntry.title}
								</p>
								{pieceEntry.price && (
									<p className="mt-1 font-sans text-sm text-stone">{pieceEntry.price}</p>
								)}
							</div>
						</div>
						{/* Right: form */}
						<PurchaseInquiryForm pieceSlug={slug} pieceTitle={pieceEntry.title} />
					</div>
				) : (
					// Full-width form when no item context (direct URL or invalid slug)
					<div className="max-w-screen-md">
						<PurchaseInquiryForm pieceSlug={slug} pieceTitle={pieceTitle} />
					</div>
				)}
			</div>
		</main>
	)
}
