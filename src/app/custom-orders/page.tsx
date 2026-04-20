import { CustomOrderForm } from "@/components/CustomOrderForm"
import da from "../../../messages/da.json"

export default function CustomOrdersPage() {
	return (
		<main className="py-24 pb-16">
			<div className="mx-auto max-w-screen-md px-6 sm:px-12 lg:px-16">
				<h1 className="mb-4 font-normal font-serif text-5xl text-ink tracking-tight">
					{da.contact.customOrders.form.heading}
				</h1>
				<p className="mb-12 font-normal font-sans text-base text-stone">
					{da.contact.customOrders.form.subCopy}
				</p>
				<CustomOrderForm />
			</div>
		</main>
	)
}
