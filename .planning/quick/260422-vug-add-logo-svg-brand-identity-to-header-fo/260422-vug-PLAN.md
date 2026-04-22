---
quick_id: 260422-vug
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/SiteHeader.tsx
  - src/components/SiteFooter.tsx
  - src/lib/email-utils.ts
autonomous: true
must_haves:
  truths:
    - "Logo appears in the header to the left of the site name text"
    - "Footer shows logo, contact email, and Instagram link"
    - "Transactional emails include logo as inline SVG in the header block"
  artifacts:
    - path: "src/components/SiteHeader.tsx"
      provides: "Logo + site name in nav"
    - path: "src/components/SiteFooter.tsx"
      provides: "Logo + contact details (email + Instagram)"
    - path: "src/lib/email-utils.ts"
      provides: "emailShell with inline SVG logo in header"
  key_links:
    - from: "SiteHeader.tsx"
      to: "public/logo.svg"
      via: "next/image with explicit width/height"
    - from: "SiteFooter.tsx"
      to: "public/logo.svg"
      via: "next/image"
    - from: "email-utils.ts"
      to: "logo SVG shapes"
      via: "inline SVG string in emailShell header cell"
---

<objective>
Add the logo.svg brand mark to site header, footer (with contact details), and transactional email templates.

Purpose: Establish consistent visual brand identity across every surface a visitor or customer encounters — the nav, the footer, and emails sent via server actions.
Output: Updated SiteHeader, SiteFooter, and emailShell with logo integrated.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

Design tokens (from src/app/globals.css):
  --color-ink:        #2c2418
  --color-oat:        #ede7d9
  --color-linen:      #f5f0e8
  --color-clay:       #c4a882
  --color-stone:      #7a6a58
  --color-ink-surface:#1e1a12

Logo facts (public/logo.svg):
- viewBox="0 0 595.3 841.9" — A4 portrait canvas, very tall
- Brand mark (ceramic spiral motif) is centered roughly at x≈300, y≈425
- Text "By Blendstrup" on circular path is part of the SVG but is decorative/large-canvas
- For UI use: crop/display only the mark portion via width/height on next/image, or use as a square icon
- Logo stroke/fill color is #543f2e (close to ink — renders well on light backgrounds)
- On dark backgrounds (footer, email dark header) invert or use a white version via CSS filter

Email logo strategy: Email clients do not reliably render external image URLs from /public.
Use an inline SVG string directly in the emailShell header HTML. Simplify the SVG to only
the two path elements (the ceramic spiral mark), not the text-on-path (too complex/large for email).
This keeps the logo crisp in any email client without a remote image dependency.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add logo to SiteHeader</name>
  <files>src/components/SiteHeader.tsx</files>
  <action>
Import `Image` from `next/image`. Inside the `<Link href="/">` element, add the logo before the site name text:

```tsx
<Link href="/" className="flex items-center gap-2.5 font-normal font-serif text-[28px] text-ink tracking-tight transition-opacity duration-150 hover:opacity-70">
  <Image
    src="/logo.svg"
    alt="By Blendstrup"
    width={36}
    height={36}
    className="shrink-0"
    priority
  />
  {da.site.name}
</Link>
```

Use width=36 height=36 to render it as a compact square icon. The SVG viewBox is tall (portrait A4) so next/image will letterbox it — add `style={{ objectFit: 'contain' }}` or simply set both dimensions equal and let the browser show the full SVG at that size. Because the mark is centered in the canvas it will appear as a small circular ceramic motif beside the text.

The wrapping `<Link>` must have `flex items-center gap-2.5` so the logo and text sit on the same baseline. Keep all existing hover/typography classes.
  </action>
  <verify>
Run `pnpm dev` and visit http://localhost:3000. The header should show the ceramic spiral mark at ~36px beside "By Blendstrup" text. Logo and text should be vertically centered. Both should fade on hover as a unit (hover:opacity-70 on the Link wraps both).
  </verify>
  <done>Logo visible in header on all pages, vertically aligned with site name, hover opacity applies to the whole link block.</done>
</task>

<task type="auto">
  <name>Task 2: Rebuild SiteFooter with logo and contact details</name>
  <files>src/components/SiteFooter.tsx</files>
  <action>
Replace the minimal footer with a structured footer containing:
1. Logo (white/light on dark background via CSS filter)
2. Brand name
3. Contact email: jonasblendstrup@gmail.com
4. Instagram link (use a placeholder href for now: https://www.instagram.com/byblendstrup — the owner can update via Keystatic settings in Phase 6)

Import `Image` from `next/image` and `Link` from `next/link`.

Structure:

```tsx
import Image from "next/image"
import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="bg-ink-surface px-12 py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-screen-xl flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {/* Brand block */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="By Blendstrup"
              width={32}
              height={32}
              className="shrink-0 invert opacity-80"
            />
            <span className="font-serif text-lg font-normal text-linen/80 tracking-tight">By Blendstrup</span>
          </div>
          <p className="text-sm text-stone font-sans leading-relaxed max-w-xs">
            Håndlavede keramikker med sjæl — hvert stykke er unikt.
          </p>
        </div>

        {/* Contact block */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-stone font-sans mb-1">Kontakt</p>
          <Link
            href="mailto:jonasblendstrup@gmail.com"
            className="text-sm text-linen/70 font-sans hover:text-linen transition-colors"
          >
            jonasblendstrup@gmail.com
          </Link>
          <Link
            href="https://www.instagram.com/byblendstrup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-linen/70 font-sans hover:text-linen transition-colors"
          >
            Instagram
          </Link>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="mx-auto max-w-screen-xl mt-10 pt-6 border-t border-stone/20">
        <p className="text-xs text-stone/60 font-sans">© {new Date().getFullYear()} By Blendstrup</p>
      </div>
    </footer>
  )
}
```

The `invert` Tailwind class flips the dark logo ink (#543f2e) to near-white so it reads on the dark `ink-surface` background. `opacity-80` softens it to match the muted Japandi tone of the footer.
  </action>
  <verify>
Visit http://localhost:3000 and scroll to footer. Verify: logo mark visible (white/inverted) beside "By Blendstrup", email link and Instagram link present and clickable, responsive layout stacks on mobile. Run `pnpm build` — no TypeScript errors.
  </verify>
  <done>Footer shows logo, brand name, tagline, contact email link, Instagram link, and copyright. Layout responsive (stacked mobile, side-by-side sm+).</done>
</task>

<task type="auto">
  <name>Task 3: Add inline SVG logo to transactional email templates</name>
  <files>src/lib/email-utils.ts</files>
  <action>
Email clients block external image URLs inconsistently. The safest approach is an inline SVG embedded directly into the HTML string inside `emailShell`.

Extract and simplify the logo to just the two ceramic spiral path elements (strip the text-on-circular-path — it renders at A4 scale and is illegible at email sizes). The inline SVG should be self-contained, ~40x40 rendered size, using `viewBox="150 330 290 290"` to crop into the mark area of the original A4 canvas.

Update `emailShell` in `src/lib/email-utils.ts`. Replace the current `<!-- Header -->` table row:

```typescript
// At top of emailShell, define the cropped inline SVG logo
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 330 290 290" width="44" height="44" style="display:block;" aria-hidden="true">
  <path fill="none" stroke="#543f2e" stroke-miterlimit="10" stroke-width="8" d="M222.6,456c3.4-5.6,9-3.9,21.8-10.4,3.7-1.9,7.8-4,12.2-8,1.2-1,5.7-5.2,10.1-13,7.3-12.9,4.5-18.2,10.3-22.8,5.4-4.2,12.5-3.5,16.9-3,3.1.3,17.5,1.9,22,12.8,2.7,6.3,1.2,13.8-2.1,19-5,7.9-11.4,5.8-25.2,15.7-3.5,2.5-9.1,6.6-14.7,13.5-6.3,7.7-6.5,11.4-13.5,18.3-4.6,4.5-8.6,8.4-14.1,8.3-3.1,0-6.2-2.1-12.4-6.4-7.4-5.1-11.2-7.7-12.6-11.8-.2-.6-2.3-6.9,1-12.2Z"/>
  <path fill="none" stroke="#543f2e" stroke-miterlimit="10" stroke-width="8" d="M218.5,421.8c-7.2-4.4-6.1-17.1-5.6-23.1,1.5-17.3,10.6-29.4,14.8-34.8,12-15.5,26.5-22.3,30.3-24,8.5-3.8,25.2-9.3,45.3-5.3,4.6.9,20,4.5,33.5,16.2,5.7,4.9,5.9,6.8,15.1,15.2,11.9,10.8,14.8,10.6,20,16.7,9.8,11.4,11.1,25.3,11.5,30.2,1.5,16.3-4.3,28.4-10.6,41.4-7.7,16-17,26.1-21.7,31-5,5.3-10.3,10.8-19,15.8-12,6.9-21.6,7.7-24.6,7.8-5.8.3-13,.6-17.4-4.3-.4-.5-4.1-4.7-3.3-9.9.9-5.6,6.3-7.7,17.1-15.4,0,0,6.7-4.8,14-11,8.8-7.5,17.4-14.9,23.2-27,2-4.2,5.2-11.1,5.3-20.7,0-1.7,0-9.7-4.1-19.1-4-9.1-9.7-14.4-16.9-21.1-5.7-5.2-11.6-10.8-21.3-15.3-7-3.2-14.8-6.8-25.1-5.7-2.8.3-16.5,1.8-23.1,11.8-3.6,5.4-.8,6.8-5.2,23.4-2.7,10-5.1,14.9-8.3,18.9-2.1,2.6-4.7,5.9-9.5,7.9-1.2.5-8.9,3.5-14.3.2Z"/>
</svg>`
```

Then update the `<!-- Header -->` table row inside `emailShell` to use the logo beside the brand label:

Replace the current header `<td>` content with:
```html
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
```

Note: `LOGO_SVG` is a constant string defined before the `emailShell` function — it is NOT user-supplied so it does NOT need `escHtml` escaping. Only `subject` (which can contain user input) must remain escaped.

The `viewBox="150 330 290 290"` crops the A4 SVG canvas to show just the ceramic mark. width/height="44" gives a good email header size. Table-based layout for the logo+text pair is required because email clients do not support flexbox.
  </action>
  <verify>
Run `pnpm build` — TypeScript must compile without errors. Manually inspect the HTML output of `emailShell("test content", "Test Subject")` by adding a temporary `console.log` in a test or by reading the function output — the header should contain the inline SVG paths and the logo beside "By Blendstrup". Remove console.log after verification.

Full automated check: `pnpm test` — existing email-related tests in `src/__tests__/` must continue to pass.
  </verify>
  <done>emailShell header block contains inline SVG logo (two path elements, cropped viewBox) beside the brand label. All existing tests pass. Build compiles cleanly.</done>
</task>

</tasks>

<verification>
- `pnpm build` exits 0 with no TypeScript errors
- `pnpm test` — all tests in src/__tests__/ pass
- Logo visible in header (light background): ceramic mark beside "By Blendstrup" text
- Logo visible in footer (dark background): inverted/white ceramic mark
- Email HTML string contains inline SVG paths in header block
</verification>

<success_criteria>
Brand logo is consistently present across: site header nav, site footer (with email + Instagram contact), and transactional email templates. No external image dependencies in email. Build and tests pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260422-vug-add-logo-svg-brand-identity-to-header-fo/260422-vug-SUMMARY.md` with what was done, files changed, and any decisions made.
</output>
