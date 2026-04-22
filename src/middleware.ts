import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_COOKIE = "admin_session"

async function deriveExpectedToken(): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_PASSWORD ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(process.env.ADMIN_USERNAME ?? ""),
  )
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE)?.value
  const expected = await deriveExpectedToken()

  if (sessionCookie === expected) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/admin-login", request.url)
  loginUrl.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/keystatic", "/keystatic/:path*"],
}
