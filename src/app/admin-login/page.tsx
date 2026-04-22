"use client"
import { useActionState } from "react"
import { loginAction } from "./actions"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-linen)]">
      <div className="w-full max-w-sm px-8 py-12 border border-[var(--color-clay)] bg-[var(--color-oat)]">
        <h1 className="font-serif text-2xl text-[var(--color-ink)] mb-8 text-center tracking-wide">
          Admin
        </h1>
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs uppercase tracking-widest text-[var(--color-stone)]"
            >
              Brugernavn
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="border border-[var(--color-clay)] bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-widest text-[var(--color-stone)]"
            >
              Adgangskode
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-[var(--color-clay)] bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-[var(--color-fault)]">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 py-2.5 px-4 text-xs uppercase tracking-widest bg-[var(--color-ink)] text-[var(--color-linen)] hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {pending ? "Logger ind…" : "Log ind"}
          </button>
        </form>
      </div>
    </main>
  )
}
