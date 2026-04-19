import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"

export default function SiteHeader() {
	const t = useTranslations()

	return (
		<header className="sticky top-0 z-40 h-16 border-clay/30 border-b bg-oat">
			<div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-12 lg:px-16">
				{/* Site name — brand, not translated */}
				<span className="font-normal font-serif text-[28px] text-ink tracking-tight">
					{t("site.name")}
				</span>
				<nav aria-label="Main navigation">
					<Link
						href="/gallery"
						className="font-medium text-sm text-stone transition-colors duration-150 hover:text-ink hover:underline hover:decoration-terracotta"
					>
						{t("navigation.gallery")}
					</Link>
				</nav>
				<LanguageToggle />
			</div>
		</header>
	)
}
