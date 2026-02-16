// src/i18n/runtime.ts
import { createTranslator, type Locale } from "@/i18n"

export function detectLocaleFromPath(pathname: string): Locale {
  const p = pathname || "/"
  if (p === "/fr" || p.startsWith("/fr/")) return "fr"
  if (p === "/lb" || p.startsWith("/lb/")) return "lb"
  return "en"
}

export function localeRoot(locale: Locale) {
  if (locale === "fr") return "/fr/"
  if (locale === "lb") return "/lb/"
  return "/"
}

export function makeI18nFromLocation() {
  const locale = detectLocaleFromPath(window.location.pathname)
  const t = createTranslator(locale)
  return { locale, t }
}
