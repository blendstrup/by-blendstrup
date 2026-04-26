import { WorkDetail } from "@/components/WorkDetail"
import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import keystaticConfig from "../../../../../keystatic.config"
import da from "../../../../../messages/da.json"

interface WorkDetailPageProps {
	params: Promise<{ slug: string }>
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const reader = createReader(process.cwd(), keystaticConfig)
	const work = await reader.collections.works.read(slug)

	if (!work || !work.published) {
		return {
			...baseMetadata,
			title: "Keramik",
		}
	}

	const firstImagePath =
		(work.images as Array<{ image: string | null; alt: string }>)[0]?.image ??
		null
	const firstImageAlt =
		(work.images as Array<{ image: string | null; alt: string }>)[0]?.alt ??
		work.title

	// Trim description at word boundary to ~120 chars
	const rawDesc = work.description ?? ""
	const trimmedDesc =
		rawDesc.length > 120
			? `${rawDesc.slice(0, 120).replace(/\s+\S*$/, "")} — By Blendstrup.`
			: rawDesc || undefined

	return {
		...baseMetadata,
		title: work.title,
		description: trimmedDesc,
		openGraph: {
			...baseMetadata.openGraph,
			title: `${work.title} — By Blendstrup`,
			description: trimmedDesc,
			...(firstImagePath
				? {
						images: [
							{
								url: firstImagePath,
								width: 1200,
								height: 630,
								alt: firstImageAlt,
							},
						],
					}
				: {}),
		},
	}
}

export async function generateStaticParams() {
	const reader = createReader(process.cwd(), keystaticConfig)
	const works = await reader.collections.works.all()

	return works.filter((w) => w.entry.published).map((w) => ({ slug: w.slug }))
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

	const mediaGallery = (
		work.mediaGallery as Array<{
			type: string
			image: string | null
			imageAlt: string
			video: string | null
			title: string
			tags: string[]
		}>
	)?.map((item) => ({
		type: item.type as "image" | "video",
		image: (item.image as string | null) ?? null,
		imageAlt: item.imageAlt ?? "",
		video: (item.video as string | null) ?? null,
		title: item.title ?? "",
		tags: (item.tags as string[]) ?? [],
	}))

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
			video={(work.video as string | null) ?? null}
			mediaGallery={mediaGallery ?? []}
			ctaLabels={{
				contactToBuy: da.gallery.contactToBuy,
				soldMessage: da.gallery.soldMessage,
				soldCta: da.gallery.soldCta,
			}}
		/>
	)
}
