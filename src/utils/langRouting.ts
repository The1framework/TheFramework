// src/utils/langRouting.ts
import type { Locale } from "@/i18n"

export const SUPPORTED_PREFIXES = ["fr", "lb"] as const

const trimSlashes = (s: string) => (s || "").replace(/^\/+|\/+$/g, "")

export function getBasePath(): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  if (!base || base === "/") return ""
  return base
}

export function stripBase(pathname: string): string {
  const p = pathname || "/"
  const base = getBasePath()
  if (!base) return p
  if (p === base) return "/"
  if (p.startsWith(base + "/")) return p.slice(base.length) || "/"
  return p
}

export function getLangFromPath(pathname: string): Locale {
  const clean = stripBase(pathname)
  const seg = clean.split("/").filter(Boolean)[0]?.toLowerCase()

  if (seg === "fr") return "fr"
  if (seg === "lb") return "lb"
  return "en"
}

export function stripLocalePrefix(pathname: string): string {
  const clean = stripBase(pathname)
  const segs = clean.split("/").filter(Boolean)
  const first = segs[0]?.toLowerCase()

  if (first && SUPPORTED_PREFIXES.includes(first as any)) {
    const rest = "/" + segs.slice(1).join("/")
    return rest === "/" ? "/" : rest
  }
  return clean || "/"
}

export function localePrefix(locale: Locale): "" | "/fr" | "/lb" {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

export function buildPathWithLocale(locale: Locale, cleanPath: string): string {
  const p = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`
  const pref = localePrefix(locale)
  const raw = `${pref}${p}` || "/"
  // DO NOT add base here because BrowserRouter basename already handles it
  return raw === "/en" ? "/" : raw
}

export function buildSwitchLocaleHref(target: Locale, currentFullPath: string): string {
  // currentFullPath should include pathname + search + hash
  const [pathAndQuery, hash = ""] = currentFullPath.split("#")
  const [pathname, search = ""] = pathAndQuery.split("?")

  const cleanPath = stripLocalePrefix(pathname || "/")
  const nextPath = buildPathWithLocale(target, cleanPath)

  const q = search ? `?${search}` : ""
  const h = hash ? `#${hash}` : ""
  return `${nextPath}${q}${h}`
}
