"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks() {
	const pathname = usePathname()

	const links = [
		{ href: "/gallery", label: "Keramik" },
		{ href: "/contact", label: "Kontakt" },
	]

	return (
		<nav aria-label="Main navigation" className="flex gap-8">
			{links.map(({ href, label }) => {
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
						{label}
					</Link>
				)
			})}
		</nav>
	)
}
