"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"

export default function LanguageToggle() {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const t = useTranslations("languageToggle")

	function switchLocale(nextLocale: "da" | "en") {
		if (nextLocale === locale) return
		router.push(pathname, { locale: nextLocale })
	}

	return (
		<div
			className="flex h-11 items-center gap-2"
			aria-label="Language selector"
		>
			{/* DA button */}
			<button
				type="button"
				onClick={() => switchLocale("da")}
				aria-current={locale === "da" ? "true" : undefined}
				className={[
					"min-h-[44px] px-1 text-sm transition-none",
					locale === "da"
						? "font-medium text-terracotta"
						: "font-normal text-stone hover:underline",
				].join(" ")}
			>
				{t("da")}
			</button>

			{/* Hairline divider */}
			<span className="select-none text-clay text-sm" aria-hidden="true">
				|
			</span>

			{/* EN button */}
			<button
				type="button"
				onClick={() => switchLocale("en")}
				aria-current={locale === "en" ? "true" : undefined}
				className={[
					"min-h-[44px] px-1 text-sm transition-none",
					locale === "en"
						? "font-medium text-terracotta"
						: "font-normal text-stone hover:underline",
				].join(" ")}
			>
				{t("en")}
			</button>
		</div>
	)
}
