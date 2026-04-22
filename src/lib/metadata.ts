// src/lib/metadata.ts
// Shared baseMetadata object — spread into every page's metadata export.
// Individual pages override title and description; always re-spread openGraph.
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byblendstrup.dk"

export const baseMetadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "By Blendstrup",
		template: "%s — By Blendstrup",
	},
	description:
		"Håndlavede keramikker fra By Blendstrup. Unikke stykker til salg og mulighed for at bestille specialfremstillede keramikker.",
	openGraph: {
		siteName: "By Blendstrup",
		locale: "da_DK",
		type: "website",
		images: [
			{
				url: "/og-default.jpg",
				width: 1200,
				height: 630,
				alt: "By Blendstrup — håndlavet keramik",
			},
		],
	},
	robots: { index: true, follow: true },
	twitter: { card: "summary_large_image" },
}
