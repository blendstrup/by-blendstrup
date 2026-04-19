import { WorkCard, type WorkCardEntry } from "./WorkCard"

interface GalleryGridProps {
	works: Array<{ slug: string; entry: WorkCardEntry }>
	locale: string
	labels: { sold: string; forSale: string }
}

export function GalleryGrid({ works, locale, labels }: GalleryGridProps) {
	return (
		<ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{works.map(({ slug, entry }) => (
				<li key={slug}>
					<WorkCard slug={slug} entry={entry} locale={locale} labels={labels} />
				</li>
			))}
		</ul>
	)
}
