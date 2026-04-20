// src/lib/honeypot.ts
// No directive — pure utility, importable anywhere

/**
 * Returns true if the honeypot field was filled in (indicating a bot).
 * Whitespace-only values are treated as empty (not a bot).
 */
export function checkHoneypot(
	value: FormDataEntryValue | null | undefined,
): boolean {
	if (value === null || value === undefined) return false
	const str = String(value).trim()
	return str.length > 0
}
