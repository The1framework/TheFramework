import { useMemo } from "react"
import en from "./locales/en.json"
import fr from "./locales/fr.json"
import ar from "./locales/ar.json"

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
type JsonObject = { [key: string]: JsonValue }

type Locale = "en" | "fr" | "lb"

function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr"
  if (pathname === "/lb" || pathname.startsWith("/lb/")) return "lb"
  return "en"
}

function getValue(obj: JsonObject, keyPath: string): JsonValue | undefined {
  const parts = keyPath.split(".")
  let cur: JsonValue = obj

  for (const p of parts) {
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      const next = (cur as JsonObject)[p]
      cur = next
      continue
    }
    return undefined
  }

  return cur
}

export function useI18n() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/"
  const locale = getLocaleFromPathname(pathname)

  const dict = useMemo<JsonObject>(() => {
    if (locale === "fr") return fr as unknown as JsonObject
    if (locale === "lb") return ar as unknown as JsonObject
    return en as unknown as JsonObject
  }, [locale])

  const t = (key: string): JsonValue => {
    const val = getValue(dict, key)
    return val !== undefined ? val : key
  }

  return { t, locale }
}
