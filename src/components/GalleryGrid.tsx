import { WorkCard, type WorkCardEntry } from "./WorkCard"

interface GalleryGridProps {
	works: Array<{ slug: string; entry: WorkCardEntry; blurDataUrl?: string }>
	labels: { sold: string; forSale: string }
}

export function GalleryGrid({ works, labels }: GalleryGridProps) {
	return (
		<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{works.map(({ slug, entry, blurDataUrl }) => (
				<li key={slug}>
					<WorkCard
						slug={slug}
						entry={entry}
						labels={labels}
						blurDataUrl={blurDataUrl}
					/>
				</li>
			))}
		</ul>
	)
}
