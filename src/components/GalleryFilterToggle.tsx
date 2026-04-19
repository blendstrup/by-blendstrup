"use client"

import { usePathname, useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export function GalleryFilterToggle() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const t = useTranslations("gallery")
	const isFiltered = searchParams.get("filter") === "for-sale"

	function setFilter(active: boolean) {
		const params = new URLSearchParams(searchParams.toString())
		if (active) {
			params.set("filter", "for-sale")
		} else {
			params.delete("filter")
		}
		const query = params.toString()
		router.push(query ? `${pathname}?${query}` : pathname)
	}

	const baseClasses =
		"min-h-[44px] border-b-2 px-4 py-3 text-sm transition-colors duration-150"
	const activeClasses = "border-terracotta font-medium text-ink"
	const inactiveClasses =
		"border-transparent font-normal text-stone hover:underline hover:decoration-terracotta"

	return (
		<fieldset className="m-0 flex gap-0 border-0 p-0">
			<legend className="sr-only">{t("filterAll")}</legend>
			<button
				type="button"
				onClick={() => setFilter(false)}
				aria-pressed={!isFiltered}
				className={`${baseClasses} ${!isFiltered ? activeClasses : inactiveClasses}`}
			>
				{t("filterAll")}
			</button>
			<button
				type="button"
				onClick={() => setFilter(true)}
				aria-pressed={isFiltered}
				className={`${baseClasses} ${isFiltered ? activeClasses : inactiveClasses}`}
			>
				{t("filterForSale")}
			</button>
		</fieldset>
	)
}
