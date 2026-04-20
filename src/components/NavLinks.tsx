"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import da from "../../messages/da.json"

export function NavLinks() {
	const pathname = usePathname()

	const links = [
		{ href: "/gallery", label: da.navigation.gallery },
		{ href: "/contact", label: da.navigation.contact },
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
