// Server-only utility — do NOT import from client components.
// plaiceholder v3 requires a Buffer (not a file path string).
import fs from "node:fs"
import path from "node:path"
import { getPlaiceholder } from "plaiceholder"

/**
 * Generates a base64 LQIP blur placeholder for a ceramic image stored in /public/.
 *
 * @param publicPath - The public-relative path as stored by Keystatic,
 *   e.g. "/images/works/bowl-test/images/0/image.png". Pass null if no image.
 * @returns base64 data URI string, or undefined on any error (file missing, etc.)
 */
export async function getBlurDataUrl(
	publicPath: string | null,
): Promise<string | undefined> {
	if (!publicPath) return undefined
	try {
		const absolutePath = path.join(process.cwd(), "public", publicPath)
		const file = fs.readFileSync(absolutePath)
		const { base64 } = await getPlaiceholder(file)
		return base64
	} catch {
		return undefined
	}
}
