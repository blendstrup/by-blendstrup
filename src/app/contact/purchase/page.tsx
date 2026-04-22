import { PurchaseInquiryForm } from "@/components/PurchaseInquiryForm"
import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import type { Metadata } from "next"
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

	if (slug) {
		const reader = createReader(process.cwd(), keystaticConfig)
		const entry = await reader.collections.works.read(slug)
		// Invalid slugs return undefined — form renders without piece context (T-5-02-05)
		pieceTitle = entry?.title ?? undefined
	}

	return (
		<main className="py-24 pb-16">
			<div className="mx-auto max-w-screen-md px-6 sm:px-12 lg:px-16">
				<h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
					{da.contact.purchase.form.heading}
				</h1>
				<PurchaseInquiryForm pieceSlug={slug} pieceTitle={pieceTitle} />
			</div>
		</main>
	)
}
