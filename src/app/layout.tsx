import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { DM_Sans, Fraunces } from "next/font/google"
import da from "../../messages/da.json"
import "./globals.css"

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

//TODO Use video for hero section and make text/cta more clear
//TODO Add preview of selected item when making request for specific piece and add to email

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="da" className={`${fraunces.variable} ${dmSans.variable}`}>
			<body className="bg-linen font-sans text-ink antialiased">
				<a
					href="#main-content"
					className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:bg-oat focus-visible:px-4 focus-visible:py-2 focus-visible:font-medium focus-visible:text-ink focus-visible:text-sm"
				>
					{da.navigation.skipToContent}
				</a>
				<SiteHeader />
				<div id="main-content" className="min-h-screen">
					{children}
				</div>
				<SiteFooter />
			</body>
		</html>
	)
}
