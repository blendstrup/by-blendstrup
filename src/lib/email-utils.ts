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
 * Inline SVG of the ceramic spiral brand mark, cropped from the A4 canvas.
 * viewBox crops to just the mark area (x:150–440, y:330–620 of 595x842 original).
 * Not user-supplied — no escHtml needed.
 */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 330 290 290" width="44" height="44" style="display:block;" aria-hidden="true">
  <path fill="none" stroke="#543f2e" stroke-miterlimit="10" stroke-width="8" d="M222.6,456c3.4-5.6,9-3.9,21.8-10.4,3.7-1.9,7.8-4,12.2-8,1.2-1,5.7-5.2,10.1-13,7.3-12.9,4.5-18.2,10.3-22.8,5.4-4.2,12.5-3.5,16.9-3,3.1.3,17.5,1.9,22,12.8,2.7,6.3,1.2,13.8-2.1,19-5,7.9-11.4,5.8-25.2,15.7-3.5,2.5-9.1,6.6-14.7,13.5-6.3,7.7-6.5,11.4-13.5,18.3-4.6,4.5-8.6,8.4-14.1,8.3-3.1,0-6.2-2.1-12.4-6.4-7.4-5.1-11.2-7.7-12.6-11.8-.2-.6-2.3-6.9,1-12.2Z"/>
  <path fill="none" stroke="#543f2e" stroke-miterlimit="10" stroke-width="8" d="M218.5,421.8c-7.2-4.4-6.1-17.1-5.6-23.1,1.5-17.3,10.6-29.4,14.8-34.8,12-15.5,26.5-22.3,30.3-24,8.5-3.8,25.2-9.3,45.3-5.3,4.6.9,20,4.5,33.5,16.2,5.7,4.9,5.9,6.8,15.1,15.2,11.9,10.8,14.8,10.6,20,16.7,9.8,11.4,11.1,25.3,11.5,30.2,1.5,16.3-4.3,28.4-10.6,41.4-7.7,16-17,26.1-21.7,31-5,5.3-10.3,10.8-19,15.8-12,6.9-21.6,7.7-24.6,7.8-5.8.3-13,.6-17.4-4.3-.4-.5-4.1-4.7-3.3-9.9.9-5.6,6.3-7.7,17.1-15.4,0,0,6.7-4.8,14-11,8.8-7.5,17.4-14.9,23.2-27,2-4.2,5.2-11.1,5.3-20.7,0-1.7,0-9.7-4.1-19.1-4-9.1-9.7-14.4-16.9-21.1-5.7-5.2-11.6-10.8-21.3-15.3-7-3.2-14.8-6.8-25.1-5.7-2.8.3-16.5,1.8-23.1,11.8-3.6,5.4-.8,6.8-5.2,23.4-2.7,10-5.1,14.9-8.3,18.9-2.1,2.6-4.7,5.9-9.5,7.9-1.2.5-8.9,3.5-14.3.2Z"/>
</svg>`

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
            <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="vertical-align:middle;padding-right:12px;">${LOGO_SVG}</td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8C7355;">By Blendstrup</p>
                </td>
              </tr>
            </table>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:normal;color:#2C2418;">${escHtml(subject)}</h1>
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
