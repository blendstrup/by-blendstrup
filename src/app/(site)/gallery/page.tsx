import { GalleryFilterToggle } from "@/components/GalleryFilterToggle"
import { GalleryGrid } from "@/components/GalleryGrid"
import { getBlurDataUrl } from "@/lib/blur-placeholder"
import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import type { Metadata } from "next"
import Link from "next/link"
import keystaticConfig from "../../../../keystatic.config"

export const metadata: Metadata = {
	...baseMetadata,
	title: "Keramik",
	description:
		"Gennemse alle håndlavede keramikker fra By Blendstrup. Filtrer efter stykker til salg.",
	openGraph: {
		...baseMetadata.openGraph,
		title: "Keramik — By Blendstrup",
		description:
			"Gennemse alle håndlavede keramikker fra By Blendstrup. Filtrer efter stykker til salg.",
	},
}

interface GalleryPageProps {
	searchParams: Promise<{ filter?: string }>
}

// searchParams opt-in: this route is dynamic per request (filter state)
export const dynamic = "force-dynamic"

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
	const { filter } = await searchParams

	const reader = createReader(process.cwd(), keystaticConfig)
	const [allWorks, galleryContent] = await Promise.all([
		reader.collections.works.all(),
		reader.singletons.gallery.read(),
	])

	// CMS-02: never expose drafts on the public site
	const published = allWorks.filter((w) => w.entry.published)

	// GALL-03: URL-based filter
	const filtered =
		filter === "for-sale"
			? published.filter((w) => w.entry.saleStatus === "available")
			: published

	// DSGN-02: compute LQIP blur placeholder for each card's first image in parallel
	const works = await Promise.all(
		filtered.map(async (w) => ({
			...w,
			entry: {
				...w.entry,
				video: (w.entry.video as string | null) ?? null,
			},
			blurDataUrl: await getBlurDataUrl(w.entry.images[0]?.image ?? null),
		})),
	)

	return (
		<section className="mx-auto max-w-screen-xl px-12 py-16 lg:px-16 lg:py-24">
			<h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
				{galleryContent?.title ?? "Keramik"}
			</h1>
			<GalleryFilterToggle />
			<div className="mt-8">
				{works.length === 0 ? (
					filter === "for-sale" ? (
						<div className="py-24 text-center">
							<p className="font-sans text-base text-stone">
								{galleryContent?.emptyForSaleHeading ?? ""}
							</p>
							<p className="mt-2 font-sans text-sm text-stone">
								{galleryContent?.emptyForSaleBody ?? ""}
							</p>
							<Link
								href="/custom-orders"
								className="mt-6 inline-block border border-terracotta px-6 py-3 font-medium text-sm text-terracotta transition-colors duration-150 hover:bg-terracotta hover:text-linen"
							>
								{galleryContent?.emptyForSaleCta ?? ""}
							</Link>
						</div>
					) : (
						<div className="py-24 text-center">
							<p className="font-sans text-base text-stone">
								{galleryContent?.emptyAllHeading ?? ""}
							</p>
							<p className="mt-2 font-sans text-sm text-stone">
								{galleryContent?.emptyAllBody ?? ""}
							</p>
						</div>
					)
				) : (
					<GalleryGrid
						works={works}
						labels={{
							sold: "Solgt",
							forSale: "Til salg",
						}}
					/>
				)}
			</div>
		</section>
	)
}
