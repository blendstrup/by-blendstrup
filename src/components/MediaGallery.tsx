import { getBlurDataUrl } from "@/lib/blur-placeholder"
import Image from "next/image"

export interface MediaGalleryItem {
	type: "image" | "video"
	image: string | null
	imageAlt: string
	video: string | null
	title: string
	tags: string[]
}

interface MediaGalleryProps {
	items: MediaGalleryItem[]
	heading?: string
}

export async function MediaGallery({
	items,
	heading,
}: MediaGalleryProps): Promise<React.JSX.Element> {
	// Compute blur placeholders for all image items in parallel
	const blurUrls = await Promise.all(
		items.map((item) =>
			item.type === "image" && item.image
				? getBlurDataUrl(item.image)
				: Promise.resolve(undefined),
		),
	)

	return (
		<div>
			{heading && (
				<h2 className="mb-8 font-normal font-serif text-[22px] text-ink tracking-tight">
					{heading}
				</h2>
			)}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{items.map((item, i) => (
					<div key={`${item.image ?? item.video ?? i}`}>
						<div className="relative aspect-4/5 overflow-hidden border border-clay bg-oat">
							{item.type === "video" && item.video ? (
								<video
									src={item.video}
									autoPlay
									muted
									loop
									playsInline
									className="absolute inset-0 h-full w-full object-cover"
								/>
							) : item.image ? (
								<Image
									src={item.image}
									alt={item.imageAlt}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									placeholder={blurUrls[i] ? "blur" : "empty"}
									blurDataURL={blurUrls[i]}
								/>
							) : (
								<div className="absolute inset-0 bg-oat" />
							)}
						</div>
						{item.title && (
							<p className="mt-3 font-sans text-sm text-ink">{item.title}</p>
						)}
						{item.tags.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{item.tags.map((tag) => (
									<span
										key={tag}
										className="rounded-full border border-clay px-2 py-0.5 font-sans text-xs text-stone"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
