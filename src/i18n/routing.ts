import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
	locales: ["da", "en"] as const,
	defaultLocale: "da",
	localeDetection: true,
	// No pathnames config — simple [locale] prefix routing for a 2-locale site
})

export type Locale = (typeof routing.locales)[number]
