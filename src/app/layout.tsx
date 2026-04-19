import { DM_Sans, Fraunces } from "next/font/google"
import { getLocale } from "next-intl/server"
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

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const locale = await getLocale()
	return (
		<html
			lang={locale}
			className={`${fraunces.variable} ${dmSans.variable}`}
		>
			<body className="bg-linen font-sans text-ink antialiased">
				{children}
			</body>
		</html>
	)
}
