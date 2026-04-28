"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export type FaqItem = { question: string; answer: string }

export interface FaqAccordionProps {
	heading: string
	items: FaqItem[]
	defaultOpenIndex?: number
}

export function FaqAccordion({
	heading,
	items,
	defaultOpenIndex = 0,
}: FaqAccordionProps): React.JSX.Element | null {
	const initialIndex =
		defaultOpenIndex >= 0 && defaultOpenIndex < items.length
			? defaultOpenIndex
			: 0
	const [openIndex, setOpenIndex] = useState<number>(initialIndex)

	if (items.length === 0) {
		return null
	}

	function toggle(index: number) {
		setOpenIndex((current) => (current === index ? -1 : index))
	}

	return (
		<section className="border-clay border-t py-24">
			<div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-16">
				<h2 className="mb-8 font-normal font-serif text-[28px] text-ink tracking-tight">
					{heading}
				</h2>
				<ul className="divide-y divide-clay border-clay border-y">
					{items.map((item, i) => {
						const isOpen = openIndex === i
						const triggerId = `faq-trigger-${i}`
						const panelId = `faq-panel-${i}`
						return (
							<li key={`${triggerId}-${item.question}`}>
								<button
									type="button"
									id={triggerId}
									aria-expanded={isOpen}
									aria-controls={panelId}
									onClick={() => toggle(i)}
									className="flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-ink text-lg transition-colors duration-150 hover:text-terracotta"
								>
									<span>{item.question}</span>
									<ChevronDown
										size={20}
										strokeWidth={1.5}
										className={`shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${
											isOpen ? "rotate-180" : ""
										}`}
										aria-hidden="true"
									/>
								</button>
								<div
									// biome-ignore lint/a11y/useSemanticElements: ARIA region pattern for accordion panel
									role="region"
									id={panelId}
									aria-labelledby={triggerId}
									className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
										isOpen
											? "grid-rows-[1fr] opacity-100"
											: "grid-rows-[0fr] opacity-0"
									}`}
								>
									<div className="min-h-0 overflow-hidden">
										<div className="whitespace-pre-line pr-12 pb-6 font-sans text-base text-stone leading-relaxed">
											{item.answer}
										</div>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
