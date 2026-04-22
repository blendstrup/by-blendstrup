import Image from "next/image"
import Link from "next/link"

export default function SiteFooter() {
	return (
		<footer className="bg-ink-surface px-12 py-12 lg:px-16 lg:py-16">
			<div className="mx-auto flex max-w-screen-xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
				{/* Brand block */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2.5">
						<Image
							src="/logo.svg"
							alt="By Blendstrup"
							width={32}
							height={32}
							className="shrink-0 opacity-80 invert"
						/>
						<span className="font-normal font-serif text-lg text-linen/80 tracking-tight">
							By Blendstrup
						</span>
					</div>
					<p className="max-w-xs font-sans text-sm text-stone leading-relaxed">
						Håndlavede keramikker med sjæl — hvert stykke er unikt.
					</p>
				</div>

				{/* Contact block */}
				<div className="flex flex-col gap-2">
					<p className="mb-1 font-sans text-stone text-xs uppercase tracking-widest">
						Kontakt
					</p>
					<Link
						href="mailto:jonasblendstrup@gmail.com"
						className="font-sans text-linen/70 text-sm transition-colors hover:text-linen"
					>
						jonasblendstrup@gmail.com
					</Link>
					<Link
						href="https://www.instagram.com/byblendstrup"
						target="_blank"
						rel="noopener noreferrer"
						className="font-sans text-linen/70 text-sm transition-colors hover:text-linen"
					>
						Instagram
					</Link>
				</div>
			</div>

			{/* Bottom rule */}
			<div className="mx-auto mt-10 max-w-screen-xl border-stone/20 border-t pt-6">
				<p className="font-sans text-stone/60 text-xs">
					© {new Date().getFullYear()} By Blendstrup
				</p>
			</div>
		</footer>
	)
}
