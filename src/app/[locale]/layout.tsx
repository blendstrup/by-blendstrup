import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { type Locale, routing } from "@/i18n/routing"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { DM_Sans, Fraunces } from "next/font/google"
import { notFound } from "next/navigation"

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

interface LocaleLayoutProps {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
	children,
	params,
}: LocaleLayoutProps) {
	const { locale } = await params

	// Validate that the locale is supported — prevents arbitrary locale injection (T-02-01)
	if (!routing.locales.includes(locale as Locale)) {
		notFound()
	}

	const messages = await getMessages()
	const t = await getTranslations("navigation")

	return (
		<html lang={locale} className={`${fraunces.variable} ${dmSans.variable}`}>
			<body className="bg-linen font-sans text-ink antialiased">
				<NextIntlClientProvider messages={messages}>
					{/* Skip link — first focusable element in DOM, visually hidden until focused */}
					<a
						href="#main-content"
						className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:bg-oat focus-visible:px-4 focus-visible:py-2 focus-visible:font-medium focus-visible:text-ink focus-visible:text-sm"
					>
						{t("skipToContent")}
					</a>
					<SiteHeader />
					<main id="main-content" className="min-h-screen">
						{children}
					</main>
					<SiteFooter />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
