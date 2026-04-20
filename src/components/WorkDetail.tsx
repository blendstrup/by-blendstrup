import { Link } from "@/i18n/navigation"
import Image from "next/image"

interface WorkDetailProps {
	title: string
	description: string
	saleStatus: "available" | "sold" | "notListed"
	images: Array<{ image: string; alt: string }>
	ctaLabels: {
		contactToBuy: string
		soldMessage: string
		soldCta: string
	}
}

// Static 1×1 JPEG blur placeholder — satisfies next/image blurDataURL requirement
// for dynamic src paths. Plaiceholder integration is a Phase 6 enhancement.
const BLUR_DATA_URL =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMC/8QAHxAAAQQCAwEAAAAAAAAAAAAAAgABAxESITFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABr3XS0VGJVyD7nmf//Z"

export function WorkDetail({
	title,
	description,
	saleStatus,
	images,
	ctaLabels,
}: WorkDetailProps) {
	return (
		<article className="mx-auto max-w-screen-lg px-12 py-16 lg:px-16 lg:py-24">
			{/* Side-by-side on desktop (lg:grid-cols-[55fr_45fr]), stacked on mobile */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[55fr_45fr]">
				{/* Left column: primary image */}
				<div className="relative w-full">
					{images.length > 0 ? (
						<div className="relative w-full" style={{ minHeight: "400px" }}>
							<Image
								src={images[0]?.image ?? ""}
								alt={images[0]?.alt ?? ""}
								priority
								fill
								className="object-contain"
								sizes="(max-width: 1024px) 100vw, 55vw"
								placeholder="blur"
								blurDataURL={BLUR_DATA_URL}
							/>
						</div>
					) : (
						<div className="relative aspect-4/5 bg-oat" />
					)}
				</div>

				{/* Right column: title, description, CTA */}
				<div className="flex flex-col justify-start pt-0 lg:pt-8">
					<h1 className="font-normal font-serif text-[28px] text-ink tracking-tight">
						{title}
					</h1>
					{description && (
						<p className="mt-6 font-sans text-base text-ink leading-relaxed">
							{description}
						</p>
					)}
					<div className="mt-8">
						{saleStatus === "available" && (
							<Link
								href="/custom-orders"
								className="inline-block bg-terracotta px-6 py-3 font-medium text-linen text-sm transition-colors duration-150 hover:bg-fault"
							>
								{ctaLabels.contactToBuy}
							</Link>
						)}
						{saleStatus === "sold" && (
							<div>
								<p className="font-sans text-base text-stone">
									{ctaLabels.soldMessage}
								</p>
								<Link
									href="/custom-orders"
									className="mt-4 inline-block border border-terracotta bg-transparent px-6 py-3 font-medium text-sm text-terracotta transition-colors duration-150 hover:bg-terracotta hover:text-linen"
								>
									{ctaLabels.soldCta} →
								</Link>
							</div>
						)}
						{/* saleStatus === "notListed": no CTA — intentional */}
					</div>
				</div>
			</div>

			{/* Additional images (index 1+) — full-width below side-by-side */}
			{images.length > 1 && (
				<div className="mt-12 grid grid-cols-2 gap-4">
					{images.slice(1).map((img, i) => (
						<div
							key={img.image || i}
							className="relative aspect-4/5 overflow-hidden bg-oat"
						>
							<Image
								src={img.image}
								alt={img.alt}
								fill
								className="object-cover"
								sizes="(max-width: 640px) 100vw, 50vw"
								placeholder="blur"
								blurDataURL={BLUR_DATA_URL}
							/>
						</div>
					))}
				</div>
			)}
		</article>
	)
}
