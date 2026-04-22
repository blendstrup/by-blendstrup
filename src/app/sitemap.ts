// src/app/sitemap.ts
import { createReader } from "@keystatic/core/reader"
import type { MetadataRoute } from "next"
import keystaticConfig from "../../keystatic.config"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byblendstrup.dk"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const reader = createReader(process.cwd(), keystaticConfig)
	const works = await reader.collections.works.all()
	const publishedSlugs = works
		.filter((w) => w.entry.published)
		.map((w) => w.slug)

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/gallery`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${SITE_URL}/custom-orders`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
	]

	const dynamicRoutes: MetadataRoute.Sitemap = publishedSlugs.map((slug) => ({
		url: `${SITE_URL}/gallery/${slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}))

	return [...staticRoutes, ...dynamicRoutes]
}
