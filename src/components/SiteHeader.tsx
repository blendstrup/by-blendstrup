import Image from "next/image"
import Link from "next/link"
import da from "../../messages/da.json"
import { NavLinks } from "./NavLinks"

export default function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 h-16 border-clay/30 border-b bg-oat">
			<div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-12 lg:px-16">
				<Link
					href="/"
					className="flex items-center gap-2.5 font-normal font-serif text-[24px] text-ink tracking-tight transition-opacity duration-150 hover:opacity-70"
				>
					<Image
						src="/logo.svg"
						alt="By Blendstrup"
						width={36}
						height={36}
						className="shrink-0"
						priority
					/>
					{da.site.name}
				</Link>
				<NavLinks />
				{/* LanguageToggle removed — Danish-only site */}
			</div>
		</header>
	)
}
