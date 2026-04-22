import { baseMetadata } from "@/lib/metadata"
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
	...baseMetadata,
	title: {
		default: "By Blendstrup",
		template: "%s — By Blendstrup",
	},
	description:
		"Håndlavede keramikker fra By Blendstrup. Unikke stykker til salg og mulighed for at bestille specialfremstillede keramikker.",
}

const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-serif",
	display: "swap",
	axes: ["opsz"],
})

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["400", "500"],
})

//TODO SEO optimizations and images
//TODO Footer about creator (me) of site and link to linkedin

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="da" className={`${fraunces.variable} ${dmSans.variable}`}>
			<body className="bg-linen font-sans text-ink antialiased">{children}</body>
		</html>
	)
}
