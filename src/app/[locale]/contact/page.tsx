import { createReader } from "@keystatic/core/reader"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import keystaticConfig from "../../../../keystatic.config"
import { Mail } from "lucide-react"

// Inline SVG fallback for Instagram icon — lucide-react v1.x may rename exports
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

interface ContactPageProps {
	params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
	const { locale } = await params
	// locale is used by next-intl getTranslations internally; suppress unused var warning
	void locale

	const t = await getTranslations("contact")

	const reader = createReader(process.cwd(), keystaticConfig)
	const settings = await reader.singletons.settings.read()

	const contactEmail = settings?.contactEmail ?? ""
	const instagramHandle = settings?.instagramHandle ?? ""

	return (
		<main className="py-24 pb-16">
			<div className="mx-auto max-w-2xl px-6 sm:px-12 lg:px-16">
				<h1 className="mb-12 font-serif text-5xl font-normal tracking-tight text-ink">
					{t("heading")}
				</h1>

				<div className="space-y-12">
					{/* Block 1: Contact information (D-09, D-10, CONT-01) */}
					<section>
						<h2 className="mb-4 font-serif text-[28px] font-normal tracking-tight text-ink">
							{t("info.heading")}
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
										className="font-sans text-base font-normal text-ink underline-offset-2 transition-colors duration-150 hover:underline hover:decoration-terracotta"
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
										className="font-sans text-base font-normal text-ink underline-offset-2 transition-colors duration-150 hover:underline hover:decoration-terracotta"
									>
										@{instagramHandle}
									</a>
								</div>
							) : null}
						</div>
					</section>

					{/* Block 2: Purchase inquiry stub (D-11, SHOP-04 via contact page) */}
					<section>
						<h2 className="mb-4 font-serif text-[28px] font-normal tracking-tight text-ink">
							{t("purchase.heading")}
						</h2>
						<p className="mb-8 font-sans text-base font-normal text-stone">
							{t("purchase.body")}
						</p>
						<Link
							href="/contact/purchase"
							className="inline-block bg-terracotta px-6 py-3 font-sans text-sm font-medium text-linen transition-colors duration-150 hover:bg-stone active:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
						>
							{t("purchase.cta")}
						</Link>
					</section>

					{/* Block 3: Custom order stub (D-11, HOME-03 target) */}
					<section>
						<h2 className="mb-4 font-serif text-[28px] font-normal tracking-tight text-ink">
							{t("customOrders.heading")}
						</h2>
						<p className="mb-8 font-sans text-base font-normal text-stone">
							{t("customOrders.body")}
						</p>
						<Link
							href="/custom-orders"
							className="inline-block bg-terracotta px-6 py-3 font-sans text-sm font-medium text-linen transition-colors duration-150 hover:bg-stone active:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
						>
							{t("customOrders.cta")}
						</Link>
					</section>
				</div>
			</div>
		</main>
	)
}
