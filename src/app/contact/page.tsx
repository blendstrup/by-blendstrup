import { baseMetadata } from "@/lib/metadata"
import { createReader } from "@keystatic/core/reader"
import { Mail } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import keystaticConfig from "../../../keystatic.config"
import da from "../../../messages/da.json"

export const metadata: Metadata = {
	...baseMetadata,
	title: "Kontakt",
	description:
		"Kontakt By Blendstrup for køb af keramik eller generelle spørgsmål.",
	openGraph: {
		...baseMetadata.openGraph,
		title: "Kontakt — By Blendstrup",
		description:
			"Kontakt By Blendstrup for køb af keramik eller generelle spørgsmål.",
	},
}

const LINEN_BLUR =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFEiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCr2/aFXt2lXrNgtMON44FY0SSBR4JAHfgdiPIr1bN+vLbtIkzJjj3SWVJOVHk8kk+9FFFf/9k="

// Inline SVG for Instagram — lucide-react v1.x may rename exports
function InstagramIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
		</svg>
	)
}

export default async function ContactPage() {
	const reader = createReader(process.cwd(), keystaticConfig)
	const [settings, aboutData] = await Promise.all([
		reader.singletons.settings.read(),
		reader.singletons.about.read(),
	])

	const contactEmail = settings?.contactEmail ?? ""
	const instagramHandle = settings?.instagramHandle ?? ""
	const photoAlt = aboutData?.photoAlt ?? ""

	return (
		<main className="py-16 lg:py-24">
			<div className="mx-auto max-w-screen-xl px-12 lg:px-16">
				{/* Profile photo */}
				{aboutData?.photo ? (
					<div className="mb-12 max-h-96 overflow-hidden rounded-2xl">
						<div className="relative aspect-3/2 w-full">
							<Image
								src={aboutData.photo}
								alt={photoAlt}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 672px"
								placeholder="blur"
								blurDataURL={LINEN_BLUR}
								priority
							/>
						</div>
					</div>
				) : null}

				<h1 className="mb-12 font-normal font-serif text-5xl text-ink tracking-tight">
					{da.contact.heading}
				</h1>

				<div className="space-y-12">
					{/* Block 1: Contact information */}
					<section>
						<h2 className="mb-4 font-normal font-serif text-[28px] text-ink tracking-tight">
							{da.contact.info.heading}
						</h2>
						<div className="space-y-4">
							{contactEmail ? (
								<div className="flex items-center gap-2">
									<Mail
										size={20}
										className="shrink-0 text-stone"
										strokeWidth={1.5}
									/>
									<a
										href={`mailto:${contactEmail}`}
										className="font-normal font-sans text-base text-ink underline-offset-2 transition-colors duration-150 hover:underline hover:decoration-terracotta"
									>
										{contactEmail}
									</a>
								</div>
							) : null}
							{instagramHandle ? (
								<div className="flex items-center gap-2">
									<span className="shrink-0 text-stone">
										<InstagramIcon />
									</span>
									<a
										href={`https://instagram.com/${instagramHandle}`}
										target="_blank"
										rel="noopener noreferrer"
										className="font-normal font-sans text-base text-ink underline-offset-2 transition-colors duration-150 hover:underline hover:decoration-terracotta"
									>
										@{instagramHandle}
									</a>
								</div>
							) : null}
						</div>
					</section>

					{/* Block 2: Purchase inquiry stub */}
					<section>
						<h2 className="mb-4 font-normal font-serif text-[28px] text-ink tracking-tight">
							{da.contact.purchase.heading}
						</h2>
						<p className="mb-8 font-normal font-sans text-base text-stone">
							{da.contact.purchase.body}
						</p>
						<Link
							href="/contact/purchase"
							className="inline-block cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
						>
							{da.contact.purchase.cta}
						</Link>
					</section>

					{/* Block 3: Custom order stub */}
					<section>
						<h2 className="mb-4 font-normal font-serif text-[28px] text-ink tracking-tight">
							{da.contact.customOrders.heading}
						</h2>
						<p className="mb-8 font-normal font-sans text-base text-stone">
							{da.contact.customOrders.body}
						</p>
						<Link
							href="/custom-orders"
							className="inline-block cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium font-sans text-linen text-sm transition-colors duration-150 hover:bg-stone focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:bg-ink"
						>
							{da.contact.customOrders.cta}
						</Link>
					</section>
				</div>
			</div>
		</main>
	)
}
