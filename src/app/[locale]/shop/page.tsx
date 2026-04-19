import { createReader } from "@keystatic/core/reader"
import { getTranslations } from "next-intl/server"
import keystaticConfig from "../../../../keystatic.config"
import { ShopCard } from "@/components/ShopCard"

interface ShopPageProps {
	params: Promise<{ locale: string }>
}

export default async function ShopPage({ params }: ShopPageProps) {
	const { locale } = await params
	const t = await getTranslations("shop")

	const reader = createReader(process.cwd(), keystaticConfig)
	const allWorks = await reader.collections.works.all()

	// Filter: must be published AND saleStatus === 'available'
	// This is the same filter logic tested in shop-filter.test.ts (Plan 01 Task 2)
	const forSaleWorks = allWorks.filter(
		(w) => w.entry.published === true && w.entry.saleStatus === "available",
	)

	return (
		<main className="py-24 pb-16">
			<div className="mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-16">
				<h1 className="mb-12 font-serif text-5xl font-normal tracking-tight text-ink">
					{t("heading")}
				</h1>

				{forSaleWorks.length === 0 ? (
					<div className="py-24 text-center">
						<p className="font-serif text-[28px] font-normal tracking-tight text-ink">
							{t("empty.heading")}
						</p>
						<p className="mt-4 font-sans text-base font-normal text-stone">
							{t("empty.body")}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
						{forSaleWorks.map(({ slug, entry }) => (
							<ShopCard
								key={slug}
								slug={slug}
								entry={{
									titleDa: entry.titleDa,
									titleEn: entry.titleEn,
									price: entry.price ?? "",
									leadTime: entry.leadTime ?? "",
									saleStatus: entry.saleStatus as "available" | "sold" | "notListed",
									images: entry.images,
								}}
								locale={locale}
								labels={{
									sold: t("saleStatus.sold"),
									forSale: t("saleStatus.available"),
									contactToBuy: t("card.contactToBuy"),
								}}
							/>
						))}
					</div>
				)}
			</div>
		</main>
	)
}
