import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
	// Match all pathnames except Next.js internals, static files, and Keystatic admin/API routes
	matcher: ["/((?!_next|_vercel|keystatic|api/keystatic|.*\\..*).*)"],
}
