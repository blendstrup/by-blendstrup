import { useTranslations } from "next-intl"

export default function LocalePlaceholderPage() {
	const t = useTranslations("placeholder")

	return (
		<div className="flex min-h-[calc(100vh-64px-var(--spacing-48))] flex-col items-center justify-center px-6 py-24">
			<h1 className="text-center font-normal font-serif text-5xl text-ink tracking-tight">
				{t("heading")}
			</h1>
			<p className="mt-6 text-center font-normal text-base text-stone">
				{t("body")}
			</p>
		</div>
	)
}
