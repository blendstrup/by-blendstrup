import { CustomOrderForm } from "@/components/CustomOrderForm"
import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import type { Metadata } from "next"
import keystaticConfig from "../../../../keystatic.config"

export const metadata: Metadata = {
	...baseMetadata,
	title: "Specialbestilling",
	description:
		"Bestil din egen specialfremstillede keramik fra By Blendstrup. Fortæl hvad du drømmer om.",
	openGraph: {
		...baseMetadata.openGraph,
		title: "Specialbestilling — By Blendstrup",
		description:
			"Bestil din egen specialfremstillede keramik fra By Blendstrup. Fortæl hvad du drømmer om.",
	},
}

export default async function CustomOrdersPage() {
	const reader = createReader(process.cwd(), keystaticConfig)
	const contactContent = await reader.singletons.contact.read()

	return (
		<main className="py-24 pb-16">
			<div className="mx-auto max-w-screen-xl px-12 lg:px-16">
				<h1 className="mb-4 font-normal font-serif text-5xl text-ink tracking-tight">
					{contactContent?.customOrdersFormHeading ?? "Specialbestilling"}
				</h1>
				<p className="mb-12 font-normal font-sans text-base text-stone">
					{contactContent?.customOrdersFormSubCopy ?? ""}
				</p>
				<CustomOrderForm />
			</div>
		</main>
	)
}
