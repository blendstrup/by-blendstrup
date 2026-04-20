import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import { NavLinks } from "./NavLinks"

export default function SiteHeader() {
	const t = useTranslations()

	return (
		<header className="sticky top-0 z-40 h-16 border-clay/30 border-b bg-oat">
			<div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-12 lg:px-16">
				{/* Site name — links to homepage */}
				<Link
					href="/"
					className="font-normal font-serif text-[28px] text-ink tracking-tight transition-opacity duration-150 hover:opacity-70"
				>
					{t("site.name")}
				</Link>
				<NavLinks />
				<LanguageToggle />
			</div>
		</header>
	)
}
