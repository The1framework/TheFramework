// src/components/layout/Header.tsx
import { useEffect, useId, useMemo, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { buildSwitchLocaleHref } from "@/utils/langRouting"

type HeaderProps = {
  t: (key: string) => string
  locale: "en" | "fr" | "lb"
  brand: {
    name: string
    logoSrc?: string
    logoAltKey: string
    homeHref?: string
  }
  servicesDropdown?: Array<{
    href: string
    labelKey: string
  }>
}

function withBase(path: string) {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path

  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`

  if (base && p.startsWith(`${base}/`)) return p
  return `${base}${p}`.replace(/\/{2,}/g, "/")
}

function localePrefix(locale: HeaderProps["locale"]) {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

function hrefFor(locale: HeaderProps["locale"], path: string) {
  const pref = localePrefix(locale)
  const p = path.startsWith("/") ? path : `/${path}`
  const full = `${pref}${p}` || "/"
  return withBase(full === "/en" ? "/" : full)
}

export function Header({
  t,
  locale,
  brand,
  servicesDropdown = [
    { href: "/services/ai-website-development", labelKey: "header.services.aiWebDev" },
    { href: "/services/seo", labelKey: "header.services.seo" },
    { href: "/services/geo-llm-search-optimization", labelKey: "header.services.geo" },
    { href: "/services/answer-engine-optimization", labelKey: "header.services.aeo" },
    { href: "/services/ai-integrations-automation", labelKey: "header.services.aiAutomation" },
  ],
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesMenuId = useId()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const currentFull = useMemo(() => {
    return window.location.pathname + (window.location.search || "") + (window.location.hash || "")
  }, [])

  const langHrefEn = useMemo(() => buildSwitchLocaleHref("en", currentFull), [currentFull])
  const langHrefFr = useMemo(() => buildSwitchLocaleHref("fr", currentFull), [currentFull])
  const langHrefLb = useMemo(() => buildSwitchLocaleHref("lb", currentFull), [currentFull])

  const nav = [
    { key: "home", href: hrefFor(locale, "/"), labelKey: "header.nav.home" },
    { key: "about", href: hrefFor(locale, "/about"), labelKey: "header.nav.about" },
    { key: "services", href: hrefFor(locale, "/services"), labelKey: "header.nav.services" },
    { key: "contact", href: hrefFor(locale, "/contact"), labelKey: "header.nav.contact" },
  ] as const

  const ctaHref = hrefFor(locale, "/contact")
  const homeHref = brand.homeHref ? withBase(brand.homeHref) : hrefFor(locale, "/")

  const openServices = () => setIsServicesOpen(true)
  const closeServices = () => setIsServicesOpen(false)

  return (
    <header
      className={cn(
        "fixed top-1 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
        isScrolled
          ? "w-[calc(100%-2rem)] max-w-6xl glass-panel rounded-2xl py-3 px-5 mt-2"
          : "w-full max-w-7xl py-6 px-6"
      )}
    >
      <nav aria-label={t("header.aria.mainNav")} className="flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <a
          href={homeHref}
          className="flex items-center gap-2 group min-w-[160px]"
          aria-label={t("header.aria.homeLink")}
        >
          <div className="w-10 h-10 rounded-xl bg-primary neon-glow overflow-hidden transition-transform group-hover:scale-110">
            {brand.logoSrc ? (
              <img
                src={withBase(brand.logoSrc)}
                alt={t(brand.logoAltKey)}
                className="w-full h-full object-contain p-1"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg" aria-hidden="true">
                  {brand.name.slice(0, 1)}
                </span>
              </div>
            )}
          </div>

          <span className="font-display font-bold text-xl text-foreground">{brand.name}</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1" aria-label={t("header.aria.desktopNav")}>
          <ul className="flex items-center gap-1" role="list">
            <li>
              <a
                href={nav[0].href}
                className="animated-underline px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {t(nav[0].labelKey)}
              </a>
            </li>

            <li>
              <a
                href={nav[1].href}
                className="animated-underline px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {t(nav[1].labelKey)}
              </a>
            </li>

            {/* Services: hover dropdown + click opens /services */}
            <li
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              <a
                href={nav[2].href}
                className={cn(
                  "animated-underline px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center gap-1",
                  isServicesOpen && "text-foreground"
                )}
                aria-haspopup="menu"
                aria-expanded={isServicesOpen}
                aria-controls={servicesMenuId}
                onFocus={openServices}
                onBlur={(e) => {
                  const next = e.relatedTarget as HTMLElement | null
                  if (next && e.currentTarget.parentElement?.contains(next)) return
                  closeServices()
                }}
              >
                {t("header.nav.services")}
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </a>

              <div
                id={servicesMenuId}
                role="menu"
                aria-label={t("header.aria.servicesMenu")}
                className={cn(
                  "absolute left-0 mt-2 min-w-[260px] rounded-xl border border-white/20 bg-background/70 backdrop-blur-xl shadow-lg overflow-hidden",
                  isServicesOpen ? "block" : "hidden"
                )}
              >
                <ul className="p-2" role="list">
                  {servicesDropdown.slice(0, 6).map((item) => (
                    <li key={item.href}>
                      <a
                        role="menuitem"
                        href={hrefFor(locale, item.href)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        {t(item.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <a
                href={nav[3].href}
                className="animated-underline px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {t(nav[3].labelKey)}
              </a>
            </li>

       
          </ul>
        </div>

        {/* Right cluster: CTA + Language */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="hero" size="default">
            <a href={ctaHref}>{t("header.cta.primary")}</a>
          </Button>

          <div className="flex items-center gap-2" aria-label={t("header.aria.languageSwitcher")}>
            <a
              href={langHrefEn}
              className={cn(
                "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                locale === "en" ? "text-foreground" : "text-muted-foreground"
              )}
              aria-current={locale === "en" ? "page" : undefined}
            >
              {t("header.lang.en")}
            </a>

            <a
              href={langHrefFr}
              className={cn(
                "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                locale === "fr" ? "text-foreground" : "text-muted-foreground"
              )}
              aria-current={locale === "fr" ? "page" : undefined}
            >
              {t("header.lang.fr")}
            </a>

            <a
              href={langHrefLb}
              className={cn(
                "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                locale === "lb" ? "text-foreground" : "text-muted-foreground"
              )}
              aria-current={locale === "lb" ? "page" : undefined}
            >
              {t("header.lang.lb")}
            </a>
          </div>
        </div>

        {/* Mobile: CTA + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Button asChild variant="hero" size="sm">
            <a href={ctaHref}>{t("header.cta.primaryShort")}</a>
          </Button>

          <button
            type="button"
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? t("header.aria.closeMenu") : t("header.aria.openMenu")}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-[520px] mt-4" : "max-h-0"
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col gap-2 pb-4">
          <ul className="flex flex-col gap-1" role="list" aria-label={t("header.aria.mobileNav")}>
            {nav.map((item) => {
              if (item.key === "services") {
                return (
                  <li key={item.key} className="rounded-xl border border-white/10 bg-muted/10">
                    <a
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.labelKey)}
                    </a>

                    <div className="px-2 pb-2">
                      {servicesDropdown.slice(0, 6).map((s) => (
                        <a
                          key={s.href}
                          href={hrefFor(locale, s.href)}
                          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t(s.labelKey)}
                        </a>
                      ))}
                    </div>
                  </li>
                )
              }

              return (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="block px-4 py-3 rounded-lg transition-colors font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(item.labelKey)}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2" aria-label={t("header.aria.languageSwitcher")}>
              <a
                href={langHrefEn}
                className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                  locale === "en" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t("header.lang.en")}
              </a>

              <a
                href={langHrefFr}
                className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                  locale === "fr" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t("header.lang.fr")}
              </a>

              <a
                href={langHrefLb}
                className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-md border border-white/15 hover:border-white/30 transition-colors",
                  locale === "lb" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t("header.lang.lb")}
              </a>
            </div>

            <Button asChild variant="hero" size="sm">
              <a href={ctaHref} onClick={() => setIsMenuOpen(false)}>
                {t("header.cta.primary")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
