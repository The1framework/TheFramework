// src/routing/LangRouter.tsx
import { createContext, useContext, useEffect, useMemo } from "react"
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

  const locale = useMemo(() => getLangFromPath(location.pathname), [location.pathname])
  const cleanPath = useMemo(() => stripLocalePrefix(location.pathname), [location.pathname])

  const cleanLocation = useMemo(
    () => ({ ...location, pathname: cleanPath }),
    [location, cleanPath]
  )

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

  // Auto-redirect from EN URL to saved locale (same behavior as old website)
  useEffect(() => {
    const saved = (localStorage.getItem("selectedLanguage") || "en") as Locale
    const current = getLangFromPath(location.pathname)

    if (current === "en" && saved !== "en") {
      const target = buildPathWithLocale(saved, stripLocalePrefix(location.pathname))
      const full = `${target}${location.search || ""}${location.hash || ""}`
      navigate(full, { replace: true })
    }
  }, [location.pathname, location.search, location.hash, navigate])

  return (
    <LangRouterContext.Provider value={{ locale, t, cleanLocation, cleanPath }}>
      {children}
    </LangRouterContext.Provider>
  )
}
