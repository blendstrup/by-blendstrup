import { WorkDetail } from "@/components/WorkDetail"
import { createReader } from "@keystatic/core/reader"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import keystaticConfig from "../../../../../keystatic.config"

interface WorkDetailPageProps {
	params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
	const reader = createReader(process.cwd(), keystaticConfig)
	const works = await reader.collections.works.all()
	return works.filter((w) => w.entry.published).map((w) => ({ slug: w.slug }))
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
	const { locale, slug } = await params

	const reader = createReader(process.cwd(), keystaticConfig)
	const work = await reader.collections.works.read(slug)

	// Security: unknown or draft slug → 404 (T-3-01, T-3-08)
	if (!work || !work.published) {
		notFound()
	}

	const title = locale === "da" ? work.titleDa : work.titleEn
	const description = locale === "da" ? work.descriptionDa : work.descriptionEn

	const t = await getTranslations("gallery")

	return (
		<WorkDetail
			title={title}
			description={description ?? ""}
			saleStatus={work.saleStatus as "available" | "sold" | "notListed"}
			images={(work.images as Array<{ image: string | null; alt: string }>).map(
				(img) => ({
					image: img.image ?? "",
					alt: img.alt,
				}),
			)}
			ctaLabels={{
				contactToBuy: t("contactToBuy"),
				soldMessage: t("soldMessage"),
				soldCta: t("soldCta"),
			}}
		/>
	)
}
