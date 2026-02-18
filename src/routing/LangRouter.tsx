// src/routing/LangRouter.tsx
import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { Locale } from "@/i18n"
import { createTranslator } from "@/i18n"
import { getLangFromPath, stripLocalePrefix, buildPathWithLocale } from "@/utils/langRouting"

type LangRouterValue = {
  locale: Locale
  t: (key: string) => string
  cleanLocation: ReturnType<typeof useLocation>
  cleanPath: string
}

const LangRouterContext = createContext<LangRouterValue | null>(null)

export function useLangRouter() {
  const ctx = useContext(LangRouterContext)
  if (!ctx) throw new Error("useLangRouter must be used within <LangRouter />")
  return ctx
}

export default function LangRouter({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Locale is derived from URL prefix: /fr, /lb, or default EN with no prefix
  const locale = useMemo(() => getLangFromPath(location.pathname), [location.pathname])

  // Remove locale prefix for internal routing logic (so pages see "/services" etc.)
  const cleanPath = useMemo(() => stripLocalePrefix(location.pathname), [location.pathname])

  // Expose a "clean" location to consumers (if needed)
  const cleanLocation = useMemo(
    () => ({ ...location, pathname: cleanPath }),
    [location, cleanPath]
  )

  // Translator for the current locale
  const t = useMemo(() => createTranslator(locale), [locale])

  // Persist selected language
  useEffect(() => {
    localStorage.setItem("selectedLanguage", locale)
  }, [locale])

  // Set <html lang/dir>
  useEffect(() => {
    const isRTL = locale === "lb"
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = isRTL ? "ar" : locale
  }, [locale])

  /**
   * Auto-redirect behavior:
   * - If user previously selected FR/LB and they land on an EN URL (no prefix),
   *   redirect them to the same page in their saved locale.
   * - Avoid loops by only doing it when current URL is EN.
   */
  useEffect(() => {
    const current = getLangFromPath(location.pathname)
    if (current !== "en") return

    const saved = (localStorage.getItem("selectedLanguage") || "en") as Locale
    if (saved === "en") return

    const stripped = stripLocalePrefix(location.pathname)
    const target = buildPathWithLocale(saved, stripped)
    const full = `${target}${location.search || ""}${location.hash || ""}`

    navigate(full, { replace: true })
  }, [location.pathname, location.search, location.hash, navigate])

  return (
    <LangRouterContext.Provider value={{ locale, t, cleanLocation, cleanPath }}>
      {children}
    </LangRouterContext.Provider>
  )
}
