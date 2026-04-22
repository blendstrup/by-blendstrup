import { WorkDetail } from "@/components/WorkDetail"
import { createReader } from "@keystatic/core/reader"
import { notFound } from "next/navigation"
import keystaticConfig from "../../../../keystatic.config"
import da from "../../../../messages/da.json"

interface WorkDetailPageProps {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const reader = createReader(process.cwd(), keystaticConfig)
	const works = await reader.collections.works.all()

	return works
		.filter((w) => w.entry.published)
		.map((w) => ({ slug: w.slug }))
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
	const { slug } = await params

	const reader = createReader(process.cwd(), keystaticConfig)
	const work = await reader.collections.works.read(slug)

	// Security: unknown or draft slug → 404 (T-3-01, T-3-08)
	if (!work || !work.published) {
		notFound()
	}

	const title = work.title
	const description = work.description

	return (
		<WorkDetail
			slug={slug}
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
				contactToBuy: da.gallery.contactToBuy,
				soldMessage: da.gallery.soldMessage,
				soldCta: da.gallery.soldCta,
			}}
		/>
	)
}
