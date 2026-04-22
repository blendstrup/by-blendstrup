"use server"
import { createHmac } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE, COOKIE_MAX_AGE } from "./constants"

function deriveToken(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "")
    .update(process.env.ADMIN_USERNAME ?? "")
    .digest("hex")
}

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = ((formData.get("username") as string) ?? "").trim()
  const password = ((formData.get("password") as string) ?? "").trim()

  const validUsername = process.env.ADMIN_USERNAME ?? ""
  const validPassword = process.env.ADMIN_PASSWORD ?? ""

  const credentialsMatch =
    username === validUsername && password === validPassword

  if (!credentialsMatch) {
    return { error: "Forkert brugernavn eller adgangskode." }
  }

  const token = deriveToken()
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  redirect("/keystatic")
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect("/admin-login")
}
