import { GalleryFilterToggle } from "@/components/GalleryFilterToggle"
import { GalleryGrid } from "@/components/GalleryGrid"
import { Link } from "@/i18n/navigation"
import { createReader } from "@keystatic/core/reader"
import { getTranslations } from "next-intl/server"
import keystaticConfig from "../../../../keystatic.config"

interface GalleryPageProps {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ filter?: string }>
}

// searchParams opt-in: this route is dynamic per request (filter state)
export const dynamic = "force-dynamic"

export default async function GalleryPage({
	params,
	searchParams,
}: GalleryPageProps) {
	const { locale } = await params
	const { filter } = await searchParams

	const reader = createReader(process.cwd(), keystaticConfig)
	const allWorks = await reader.collections.works.all()

	// CMS-02: never expose drafts on the public site
	const published = allWorks.filter((w) => w.entry.published)

	// GALL-03: URL-based filter
	const works =
		filter === "for-sale"
			? published.filter((w) => w.entry.saleStatus === "available")
			: published

	const t = await getTranslations("gallery")

	return (
		<section className="mx-auto max-w-screen-xl px-12 py-16 lg:px-16 lg:py-24">
			<h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
				{t("title")}
			</h1>
			<GalleryFilterToggle />
			<div className="mt-8">
				{works.length === 0 ? (
					filter === "for-sale" ? (
						<div className="py-24 text-center">
							<p className="font-sans text-base text-stone">
								{t("emptyForSaleHeading")}
							</p>
							<p className="mt-2 font-sans text-sm text-stone">
								{t("emptyForSaleBody")}
							</p>
							<Link
								href="/custom-orders"
								className="mt-6 inline-block border border-terracotta px-6 py-3 font-medium text-sm text-terracotta transition-colors duration-150 hover:bg-terracotta hover:text-linen"
							>
								{t("emptyForSaleCta")}
							</Link>
						</div>
					) : (
						<div className="py-24 text-center">
							<p className="font-sans text-base text-stone">
								{t("emptyAllHeading")}
							</p>
							<p className="mt-2 font-sans text-sm text-stone">
								{t("emptyAllBody")}
							</p>
						</div>
					)
				) : (
					<GalleryGrid
						works={works}
						locale={locale}
						labels={{ sold: t("soldLabel"), forSale: t("forSaleLabel") }}
					/>
				)}
			</div>
		</section>
	)
}
