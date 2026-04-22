"use client"
import { useActionState } from "react"
import { loginAction } from "./actions"

export default function AdminLoginPage() {
	const [state, formAction, pending] = useActionState(loginAction, null)

	return (
		<main className="flex min-h-screen items-center justify-center bg-linen">
			<div className="w-full max-w-screen-sm rounded-lg border border-clay bg-oat px-8 py-12">
				<h1 className="mb-8 text-center font-serif text-2xl text-ink tracking-wide">
					Admin
				</h1>
				<form action={formAction} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="username"
							className="text-stone text-xs uppercase tracking-widest"
						>
							Brugernavn
						</label>
						<input
							id="username"
							name="username"
							type="text"
							required
							autoComplete="username"
							className="w-full overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="password"
							className="text-stone text-xs uppercase tracking-widest"
						>
							Adgangskode
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							autoComplete="current-password"
							className="w-full overflow-hidden rounded-sm border border-clay bg-linen px-4 py-3 font-normal font-sans text-base text-ink outline-none! ring-0! placeholder:text-stone focus:border-ink aria-invalid=true:border-fault"
						/>
					</div>
					{state?.error && <p className="text-fault text-sm">{state.error}</p>}
					<button
						type="submit"
						disabled={pending}
						className="w-full cursor-pointer overflow-hidden rounded-sm bg-ink px-4 py-2.5 font-normal font-sans text-linen text-xs uppercase tracking-widest outline-none! ring-0! transition-opacity hover:opacity-80 disabled:opacity-50"
					>
						{pending ? "Logger ind…" : "Log ind"}
					</button>
				</form>
			</div>
		</main>
	)
}
