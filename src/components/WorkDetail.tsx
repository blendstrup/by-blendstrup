import { MediaGallery, type MediaGalleryItem } from "@/components/MediaGallery"
import { getBlurDataUrl } from "@/lib/blur-placeholder"
import { toEmbedUrl } from "@/lib/video-embed"
import Image from "next/image"
import Link from "next/link"

interface WorkDetailProps {
	slug: string
	title: string
	description: string
	saleStatus: "available" | "sold" | "notListed"
	images: Array<{ image: string; alt: string }>
	video?: string | null
	mediaGallery?: MediaGalleryItem[]
	ctaLabels: {
		contactToBuy: string
		soldMessage: string
		soldCta: string
	}
}

export async function WorkDetail({
	slug,
	title,
	description,
	saleStatus,
	images,
	video,
	mediaGallery,
	ctaLabels,
}: WorkDetailProps): Promise<React.JSX.Element> {
	// DSGN-02: compute LQIP blur placeholders for all images in parallel
	const blurUrls = await Promise.all(
		images.map((img) => getBlurDataUrl(img.image || null)),
	)

	const embedSrc = toEmbedUrl(video)

	const saleStatusLabel =
		saleStatus === "available"
			? "Til salg"
			: saleStatus === "sold"
				? "Solgt"
				: null

	return (
		<article className="mx-auto max-w-screen-xl px-6 py-16 sm:px-8 lg:px-16 lg:py-24">
			{/* Side-by-side on desktop (lg:grid-cols-[55fr_45fr]), stacked on mobile */}
			<div className="grid grid-cols-1 gap-24 lg:grid-cols-[55fr_45fr]">
				{/* Left column: primary media (video or image) */}
				<div className="relative w-full">
					{embedSrc ? (
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-oat">
							<iframe
								src={embedSrc}
								allow="autoplay; fullscreen; picture-in-picture"
								allowFullScreen
								title={title}
								className="absolute inset-0 h-full w-full border-0 object-cover"
							/>
						</div>
					) : images.length > 0 ? (
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-oat">
							<Image
								src={images[0]?.image ?? ""}
								alt={images[0]?.alt ?? ""}
								priority
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 55vw"
								placeholder={blurUrls[0] ? "blur" : "empty"}
								blurDataURL={blurUrls[0]}
							/>
						</div>
					) : (
						<div className="relative aspect-4/5 rounded-2xl bg-oat" />
					)}
				</div>

				{/* Right column: title, description, metadata, CTA */}
				<div className="flex flex-col justify-start pt-0 lg:pt-8">
					<h1 className="font-normal font-serif text-[28px] text-ink tracking-tight">
						{title}
					</h1>
					{description && (
						<p className="mt-6 font-sans text-base text-ink leading-relaxed">
							{description}
						</p>
					)}

					<hr className="my-8 border-clay" />

					{/* Sale status badge */}
					{saleStatusLabel && (
						<p className="mb-6 font-sans text-sm text-stone">
							{saleStatusLabel}
						</p>
					)}

					<div>
						{saleStatus === "available" && (
							<Link
								href={`/contact/purchase?piece=${slug}`}
								className="inline-block cursor-pointer rounded-sm bg-terracotta px-6 py-3 font-medium text-linen text-sm transition-colors duration-150 hover:bg-fault"
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
									className="mt-4 inline-block cursor-pointer rounded-sm border border-terracotta bg-transparent px-6 py-3 font-medium text-sm text-terracotta transition-colors duration-150 hover:bg-terracotta hover:text-linen"
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
				<>
					<h2 className="mt-16 mb-8 font-normal font-serif text-[22px] text-ink tracking-tight">
						Detaljer
					</h2>
					<div className="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-8">
						{images.slice(1).map((img, i) => (
							<div
								key={img.image || i}
								className="relative aspect-4/5 overflow-hidden rounded-2xl bg-oat"
							>
								<Image
									src={img.image}
									alt={img.alt}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									placeholder={blurUrls[i + 1] ? "blur" : "empty"}
									blurDataURL={blurUrls[i + 1]}
								/>
							</div>
						))}
					</div>
				</>
			)}

			{/* Media gallery (optional, added via CMS) */}
			{mediaGallery && mediaGallery.length > 0 && (
				<section className="mt-16">
					<MediaGallery items={mediaGallery} heading="Galleri" />
				</section>
			)}
		</article>
	)
}
