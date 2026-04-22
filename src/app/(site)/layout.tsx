import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import da from "../../../messages/da.json"

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
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
		</>
	)
}
