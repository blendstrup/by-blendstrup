/**
 * Minimal HTML-escape helper for safe interpolation of user-controlled strings
 * into HTML email templates.
 *
 * Escapes the five characters that allow HTML injection:
 *   &  <  >  "  '
 */
export function escHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}

/**
 * Wraps content in the full email shell with brand header and footer.
 *
 * Color palette (Japandi design tokens):
 *   #F5F0E8 = linen      #FDFAF5 = near-white card
 *   #2C2418 = ink        #C4A882 = clay
 *   #8C7355 = stone      #A85C3A = terracotta
 */
export function emailShell(content: string, subject: string): string {
	return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FDFAF5;border:1px solid #C4A882;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #C4A882;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8C7355;">By Blendstrup</p>
            <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:normal;color:#2C2418;">${escHtml(subject)}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #C4A882;background:#F5F0E8;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:#8C7355;">Denne besked er sendt via kontaktformularen på byblendstrup.dk</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Renders a labeled field row (label + value) for use in email body. */
export function emailField(
	label: string,
	value: string,
	isLink?: { href: string },
): string {
	const valueHtml = isLink
		? `<a href="${escHtml(isLink.href)}" style="color:#A85C3A;font-family:sans-serif;">${escHtml(value)}</a>`
		: `<span style="font-family:sans-serif;color:#2C2418;">${escHtml(value)}</span>`
	return `
<div style="margin-bottom:20px;">
  <p style="margin:0 0 4px;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8C7355;">${escHtml(label)}</p>
  <p style="margin:0;font-family:sans-serif;font-size:15px;line-height:1.6;color:#2C2418;">${valueHtml}</p>
</div>`
}

/** Renders a horizontal divider. */
export function emailDivider(): string {
	return `<hr style="border:none;border-top:1px solid #C4A882;margin:24px 0;" />`
}

/** Renders a highlighted callout box (e.g. for the referenced piece). */
export function emailCallout(label: string, value: string): string {
	return `
<div style="background:#F5F0E8;border-left:3px solid #A85C3A;padding:16px 20px;margin-bottom:24px;">
  <p style="margin:0 0 4px;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8C7355;">${escHtml(label)}</p>
  <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-weight:normal;color:#2C2418;">${escHtml(value)}</p>
</div>`
}
