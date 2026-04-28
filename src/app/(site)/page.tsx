import { FaqAccordion } from "@/components/FaqAccordion"
import { MediaGallery } from "@/components/MediaGallery"
import { ShopCard } from "@/components/ShopCard"
import { getBlurDataUrl } from "@/lib/blur-placeholder"
import { baseMetadata } from "@/lib/metadata"
import { toEmbedUrl } from "@/lib/video-embed"
import { createReader } from "@keystatic/core/reader"
import { ChevronDown } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import keystaticConfig from "../../../keystatic.config"

export const metadata: Metadata = {
	...baseMetadata,
	title: "By Blendstrup — Håndlavet keramik",
	description:
		"Oplev håndlavede keramikker skabt med omhu. Se aktuelle stykker til salg og bestil din egen specialkeramik.",
	openGraph: {
		...baseMetadata.openGraph,
		title: "By Blendstrup — Håndlavet keramik",
		description:
			"Oplev håndlavede keramikker skabt med omhu. Se aktuelle stykker til salg og bestil din egen specialkeramik.",
	},
}

// Inline linen-colored blur placeholder (8x8 base64 JPEG)
// avoids plaiceholder dependency; acceptable for MVP hero
const LINEN_BLUR =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCr2/aFXt2lXrNgtMON44FY0SSBR4JAHfgdiPIr1bN+vLbtIkzJjj3SWVJOVHk8kk+9FFFf/9k="

export default async function HomePage() {
	const reader = createReader(process.cwd(), keystaticConfig)

	const [homepageData, aboutData] = await Promise.all([
		reader.singletons.homepage.read(),
		reader.singletons.about.read(),
	])

	// Resolve hero work slug to entry (heroWorks is a slug array per D-01)
	const heroSlug = homepageData?.heroWorks?.[0] ?? null
	const heroWork = heroSlug
		? await reader.collections.works.read(heroSlug)
		: null

	// Resolve shop preview slugs to entries — filter published+available (Pitfall 5 fix)
	const shopPreviewSlugs = homepageData?.shopPreviewWorks ?? []
	const shopPreviewWorksRaw = await Promise.all(
		shopPreviewSlugs.map(async (slug) => {
			const entry = await reader.collections.works.read(slug)
			return { slug, entry }
		}),
	)
	const shopPreviewWorksFiltered = shopPreviewWorksRaw.filter(
		(w): w is { slug: string; entry: NonNullable<typeof w.entry> } =>
			w.entry !== null &&
			w.entry.published === true &&
			w.entry.saleStatus === "available",
	)

	// DSGN-02: compute LQIP blur placeholder for each ShopCard's first image in parallel
	const shopPreviewWorks = await Promise.all(
		shopPreviewWorksFiltered.map(async (w) => ({
			...w,
			blurDataUrl: await getBlurDataUrl(w.entry.images[0]?.image ?? null),
		})),
	)

	const heroEmbedSrc = toEmbedUrl(homepageData?.heroVideo as string | null)

	const heroImage = heroEmbedSrc ? null : (heroWork?.images?.[0] ?? null)

	// FAQ items — filter empties so an in-progress entry doesn't render a blank row
	const faqItems = (homepageData?.faqItems ?? [])
		.map((item) => ({
			question: (item?.question ?? "").trim(),
			answer: (item?.answer ?? "").trim(),
		}))
		.filter((item) => item.question.length > 0 && item.answer.length > 0)

	return (
		<main>
			{/* ─── Hero Section (HOME-01, D-01, D-02, D-03) ─── */}
			{/* Height subtracts sticky header (h-16 = 4rem) so hero fills visible viewport */}
			<section className="relative h-[calc(100svh-4rem)] w-full bg-linen">
				{/* Hero media: video embed takes priority over image */}
				{heroEmbedSrc ? (
					<iframe
						src={heroEmbedSrc}
						allow="autoplay; fullscreen; picture-in-picture"
						allowFullScreen
						title="Hero video"
						tabIndex={-1}
						className="absolute inset-0 h-full w-full border-0 object-cover"
					/>
				) : heroImage?.image ? (
					<Image
						src={heroImage.image}
						alt={heroImage.alt ?? ""}
						fill
						priority
						className="object-cover"
						sizes="100vw"
						placeholder="blur"
						blurDataURL={LINEN_BLUR}
					/>
				) : null}

				{/* Subtle dark vignette so text is legible over any photo or video */}
				<div className="pointer-events-none absolute inset-0 bg-ink/25" />

				{/* Hero copy — bottom-left for Japandi editorial feel */}
				<div className="absolute inset-0 flex flex-col items-start justify-end px-8 pb-16 sm:px-12 lg:px-16 lg:pb-20">
					<h1 className="font-normal font-serif text-5xl text-linen tracking-tight drop-shadow-sm md:text-7xl">
						{homepageData?.heroHeadline ?? "Håndlavet keramik"}
					</h1>
					<Link
						href="/gallery"
						className="mt-6 inline-block cursor-pointer rounded-sm border border-linen px-8 py-3 font-medium font-sans text-linen text-sm transition-colors duration-200 hover:bg-linen hover:text-ink focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-2"
					>
						{homepageData?.heroCta ?? "Se samlingen"}
					</Link>
				</div>

				{/* Scroll indicator — centered, decorative */}
				<div
					aria-hidden="true"
					className="-translate-x-1/2 absolute bottom-8 left-1/2 flex flex-col items-center gap-1"
				>
					<ChevronDown
						size={20}
						className="text-linen/70 motion-safe:animate-bounce"
						strokeWidth={1.5}
					/>
					<span className="font-medium font-sans text-linen/70 text-sm">
						{homepageData?.heroScrollIndicator ?? "Rul ned"}
					</span>
				</div>
			</section>

			{/* ─── Shop Preview Section (HOME-02, D-01 shopPreviewWorks) ─── */}
			<section className="border-clay border-t py-24">
				<div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16">
					<div className="mb-8 flex items-baseline justify-between">
						<h2 className="font-normal font-serif text-[28px] text-ink tracking-tight">
							{homepageData?.shopPreviewHeading ?? "Til salg"}
						</h2>
						<Link
							href="/gallery?filter=for-sale"
							className="font-medium font-sans text-sm text-stone underline-offset-2 transition-colors duration-150 hover:text-ink hover:underline hover:decoration-terracotta"
						>
							{homepageData?.shopPreviewViewAll ?? "Se alle varer"}
						</Link>
					</div>

					{shopPreviewWorks.length === 0 ? (
						<p className="font-normal font-sans text-base text-stone">
							{homepageData?.shopPreviewEmpty ?? ""}
						</p>
					) : (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
							{shopPreviewWorks
								.slice(0, 6)
								.map(({ slug, entry, blurDataUrl }) => (
									<ShopCard
										key={slug}
										slug={slug}
										entry={{
											title: entry.title,
											price: entry.price ?? "",
											leadTime: entry.leadTime ?? "",
											saleStatus: entry.saleStatus as
												| "available"
												| "sold"
												| "notListed",
											images: entry.images,
										}}
										labels={{
											sold: "Solgt",
											forSale: "Til salg",
											contactToBuy: "Kontakt for køb",
										}}
										blurDataUrl={blurDataUrl}
									/>
								))}
						</div>
					)}
				</div>
			</section>

			{/* ─── About Section (HOME-04) ─── */}
			<section className="border-clay border-t bg-oat py-24">
				<div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
						{/* Photo — left column on desktop, top on mobile */}
						<div className="relative aspect-square overflow-hidden rounded-2xl border border-clay lg:aspect-4/5">
							{aboutData?.photo ? (
								<Image
									src={aboutData.photo}
									alt={aboutData?.photoAlt ?? ""}
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 40vw"
									placeholder="blur"
									blurDataURL={LINEN_BLUR}
								/>
							) : (
								<div className="absolute inset-0 bg-oat" />
							)}
						</div>

						{/* Text — right column on desktop, below photo on mobile */}
						<div className="flex flex-col justify-center space-y-4">
							<h2 className="font-normal font-serif text-[28px] text-ink tracking-tight">
								{homepageData?.aboutHeading ?? "Om Laura"}
							</h2>
							{aboutData ? (
								<>
									{aboutData?.aboutText?.split("\n\n").map((paragraph) => (
										<p
											key={paragraph.slice(0, 40)}
											className="font-normal font-sans text-base text-ink leading-relaxed"
										>
											{paragraph}
										</p>
									))}
								</>
							) : null}
						</div>
					</div>
				</div>
			</section>

			{/* ─── FAQ Section ─── */}
			{faqItems.length > 0 && (
				<FaqAccordion
					heading={homepageData?.faqHeading ?? "Ofte stillede spørgsmål"}
					items={faqItems}
					defaultOpenIndex={0}
				/>
			)}

			{/* ─── Custom Order CTA Section (HOME-03, D-13) ─── */}
			<section className="border-clay border-t bg-oat py-24">
				<div className="mx-auto max-w-screen-xl px-6 text-center sm:px-8 lg:px-16">
					<h2 className="font-normal font-serif text-[28px] text-ink tracking-tight">
						{homepageData?.customOrdersHeading ?? "Noget særligt i tankerne?"}
					</h2>
					<p className="mt-8 font-normal font-sans text-base text-stone">
						{homepageData?.customOrdersBody ?? ""}
					</p>
					<div className="mt-8">
						<Link
							href="/custom-orders"
							className="inline-block cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
						>
							{homepageData?.customOrdersCta ?? "Start en specialbestilling"}
						</Link>
					</div>
				</div>
			</section>

			{/* ─── Homepage Media Gallery Section ─── */}
			{homepageData?.mediaGallery && homepageData.mediaGallery.length > 0 && (
				<section className="border-clay border-t py-24">
					<div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16">
						<MediaGallery
							items={(
								homepageData.mediaGallery as Array<{
									type: string
									image: string | null
									imageAlt: string
									video: string | null
									title: string
									tags: string[]
								}>
							).map((item) => ({
								type: item.type as "image" | "video",
								image: (item.image as string | null) ?? null,
								imageAlt: item.imageAlt ?? "",
								video: (item.video as string | null) ?? null,
								title: item.title ?? "",
								tags: (item.tags as string[]) ?? [],
							}))}
							heading={homepageData?.galleryHeading ?? "Galleri"}
						/>
					</div>
				</section>
			)}
		</main>
	)
}
