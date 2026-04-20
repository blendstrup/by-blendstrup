"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function NavLinks() {
	const pathname = usePathname()
	const t = useTranslations("navigation")

	const links = [
		{ href: "/gallery" as const, key: "gallery" },
		{ href: "/contact" as const, key: "contact" },
	]

	return (
		<nav aria-label="Main navigation" className="flex gap-8">
			{links.map(({ href, key }) => {
				const isActive = pathname === href || pathname.startsWith(`${href}/`)
				return (
					<Link
						key={href}
						href={href}
						className={
							isActive
								? "font-medium text-ink text-sm underline decoration-terracotta transition-colors duration-150"
								: "font-medium text-sm text-stone transition-colors duration-150 hover:text-ink hover:underline hover:decoration-terracotta"
						}
					>
						{t(key)}
					</Link>
				)
			})}
		</nav>
	)
}
