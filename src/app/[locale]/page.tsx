import { ShopCard } from "@/components/ShopCard"
import { Link } from "@/i18n/navigation"
import { createReader } from "@keystatic/core/reader"
import { ChevronDown } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import keystaticConfig from "../../../keystatic.config"

// Inline linen-colored blur placeholder (8x8 base64 JPEG)
// avoids plaiceholder dependency; acceptable for MVP hero
const LINEN_BLUR =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCr2/aFXt2lXrNgtMON44FY0SSBR4JAHfgdiPIr1bN+vLbtIkzJjj3SWVJOVHk8kk+9FFFf/9k="

interface HomePageProps {
	params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
	const { locale } = await params
	const t = await getTranslations("home")
	const tShop = await getTranslations("shop")

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
	// reader.collections.works.read(slug) returns entry fields directly (not {slug, entry})
	// Keep track of slugs alongside entries
	const shopPreviewSlugs = homepageData?.shopPreviewWorks ?? []
	const shopPreviewWorksRaw = await Promise.all(
		shopPreviewSlugs.map(async (slug) => {
			const entry = await reader.collections.works.read(slug)
			return { slug, entry }
		}),
	)
	const shopPreviewWorks = shopPreviewWorksRaw.filter(
		(w): w is { slug: string; entry: NonNullable<typeof w.entry> } =>
			w.entry !== null &&
			w.entry.published === true &&
			w.entry.saleStatus === "available",
	)

	const heroImage = heroWork?.images?.[0] ?? null

	return (
		<main>
			{/* ─── Hero Section (HOME-01, D-01, D-02, D-03) ─── */}
			{/* Height subtracts sticky header (h-16 = 4rem) so hero fills visible viewport */}
			<section className="relative h-[calc(100svh-4rem)] w-full bg-linen">
				{heroImage?.image ? (
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

				{/* Subtle dark vignette so text is legible over any photo */}
				<div className="pointer-events-none absolute inset-0 bg-ink/25" />

				{/* Hero copy — centered, encourages exploration */}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					<h1 className="font-normal font-serif text-5xl text-linen tracking-tight drop-shadow-sm md:text-7xl">
						{t("hero.headline")}
					</h1>
					<Link
						href="/gallery"
						className="mt-8 inline-block border border-linen px-8 py-3 font-medium font-sans text-linen text-sm transition-colors duration-200 hover:bg-linen hover:text-ink focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-2"
					>
						{t("hero.cta")}
					</Link>
				</div>

				{/* Scroll indicator */}
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
						{t("hero.scrollIndicator")}
					</span>
				</div>
			</section>

			{/* ─── Shop Preview Section (HOME-02, D-01 shopPreviewWorks) ─── */}
			<section className="border-clay border-t py-24">
				<div className="mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-16">
					<div className="mb-8 flex items-baseline justify-between">
						<h2 className="font-normal font-serif text-5xl text-ink tracking-tight">
							{t("shopPreview.heading")}
						</h2>
						<Link
							href="/gallery?filter=for-sale"
							className="font-medium font-sans text-sm text-stone underline-offset-2 transition-colors duration-150 hover:text-ink hover:underline hover:decoration-terracotta"
						>
							{t("shopPreview.viewAll")}
						</Link>
					</div>

					{shopPreviewWorks.length === 0 ? (
						<p className="font-normal font-sans text-base text-stone">
							{t("shopPreview.empty")}
						</p>
					) : (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
							{shopPreviewWorks.slice(0, 6).map(({ slug, entry }) => (
								<ShopCard
									key={slug}
									slug={slug}
									entry={{
										titleDa: entry.titleDa,
										titleEn: entry.titleEn,
										price: entry.price ?? "",
										leadTime: entry.leadTime ?? "",
										saleStatus: entry.saleStatus as
											| "available"
											| "sold"
											| "notListed",
										images: entry.images,
									}}
									locale={locale}
									labels={{
										sold: tShop("saleStatus.sold"),
										forSale: tShop("saleStatus.available"),
										contactToBuy: tShop("card.contactToBuy"),
									}}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* ─── About Section (HOME-04) ─── */}
			<section className="border-clay border-t bg-oat py-24">
				<div className="mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-16">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
						{/* Photo — left column on desktop, top on mobile */}
						<div className="relative aspect-square overflow-hidden border border-clay lg:aspect-4/5">
							{aboutData?.photo ? (
								<Image
									src={aboutData.photo}
									alt={
										locale === "da"
											? (aboutData.photoAltDa ?? "")
											: (aboutData.photoAltEn ?? "")
									}
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
								{t("about.heading")}
							</h2>
							{aboutData ? (
								<>
									{(locale === "da"
										? aboutData.aboutTextDa
										: aboutData.aboutTextEn
									)
										?.split("\n\n")
										.map((paragraph) => (
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

			{/* ─── Custom Order CTA Section (HOME-03, D-13) ─── */}
			<section className="border-clay border-t bg-oat py-24">
				<div className="mx-auto max-w-screen-md px-6 text-center sm:px-12 lg:px-16">
					<h2 className="font-normal font-serif text-[28px] text-ink tracking-tight">
						{t("customOrders.heading")}
					</h2>
					<p className="mt-8 font-normal font-sans text-base text-stone">
						{t("customOrders.body")}
					</p>
					<div className="mt-8">
						<Link
							href="/custom-orders"
							className="inline-block cursor-pointer bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
						>
							{t("customOrders.cta")}
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
