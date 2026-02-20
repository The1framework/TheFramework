// src/pages/Services.tsx
import { useMemo } from "react"
import type React from "react"
import type { Locale } from "@/i18n"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { Link } from "react-router-dom"
import {
  Code2,
  Gauge,
  Palette,
  Search,
  Globe2,
  MessageCircle,
  Megaphone,
  PenSquare,
  ShoppingBag,
  Workflow,
  CheckCircle2,
} from "lucide-react"

type ServiceKey =
  | "aiWebsiteDev"
  | "fullStackDev"
  | "performanceOptimization"
  | "uxui"
  | "seo"
  | "geoLLM"
  | "aeo"
  | "ppc"
  | "contentWriting"
  | "ecommerce"
  | "aiAutomation"

type ServiceItem = {
  key: ServiceKey
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const SERVICES: ServiceItem[] = [
  {
    key: "fullStackDev",
    href: "/services/full-stack-web-app-development",
    icon: Code2,
  },
  {
    key: "performanceOptimization",
    href: "/services/website-optimization-performance",
    icon: Gauge,
  },
  {
    key: "uxui",
    href: "/services/ux-ui-design-user-experience",
    icon: Palette,
  },
  {
    key: "seo",
    href: "/services/seo",
    icon: Search,
  },
  {
    key: "geoLLM",
    href: "/services/geo-llm-search-optimization",
    icon: Globe2,
  },
  {
    key: "aeo",
    href: "/services/answer-engine-optimization",
    icon: MessageCircle,
  },
  {
    key: "ppc",
    href: "/services/paid-advertising-ppc",
    icon: Megaphone,
  },
  {
    key: "contentWriting",
    href: "/services/content-professional-writing",
    icon: PenSquare,
  },
  {
    key: "ecommerce",
    href: "/services/ecommerce-solutions",
    icon: ShoppingBag,
  },
  {
    key: "aiAutomation",
    href: "/services/ai-integrations-automation",
    icon: Workflow,
  },
]

const CTA_PRIMARY_HREF = "/contact"
const CTA_SECONDARY_HREF = "/contact"

type ServicesPageProps = {
  locale: Locale
  t: (key: string) => string
}

function localePrefix(locale: Locale) {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

function routerTo(locale: Locale, path: string) {
  const pref = localePrefix(locale)
  const p = path.startsWith("/") ? path : `/${path}`
  const full = `${pref}${p}`.replace(/\/{2,}/g, "/")
  return full === "/en" ? "/" : full
}

export default function Services({ locale, t }: ServicesPageProps) {
  const isRTL = locale === "lb"

  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>()
  const { ref: listRef, isVisible: listVisible } = useScrollReveal<HTMLElement>()
  const { ref: audiencesRef, isVisible: audiencesVisible } = useScrollReveal<HTMLElement>()
  const { ref: outcomesRef, isVisible: outcomesVisible } = useScrollReveal<HTMLElement>()
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal<HTMLElement>()
  const { ref: faqRef, isVisible: faqVisible } = useScrollReveal<HTMLElement>()

  const forWhoItems = useMemo(() => {
    const raw = t("services.page.forWho.items") as unknown
    return Array.isArray(raw) ? (raw as string[]) : []
  }, [t])

  const outcomeItems = useMemo(() => {
    const raw = t("services.page.outcomes.items") as unknown
    return Array.isArray(raw) ? (raw as string[]) : []
  }, [t])

  const faqItems = useMemo(() => {
    const raw = t("services.page.faq.items") as unknown
    if (Array.isArray(raw)) {
      return (raw as Array<{ q: string; a: string }>).map((item) => ({
        q: item.q,
        a: item.a,
      }))
    }
    return []
  }, [t])

  return (
    <main className="pt-32 pb-20">
      <section ref={heroRef} id="services-hero" aria-labelledby="services-hero-heading" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6">
          <div
            className={cn(
              "glass-panel rounded-3xl px-6 md:px-10 py-12 md:py-16 relative border border-white/10",
              "shadow-[0_0_60px_rgba(56,189,248,0.25)] backdrop-blur-2xl overflow-hidden",
              "transition-all duration-700",
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <div className="absolute inset-px rounded-[1.4rem] bg-gradient-to-br from-white/5 via-transparent to-primary/10 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h1
                id="services-hero-heading"
                className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance text-primary"
              >
                {t("services.page.hero.h1") as string}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
                {t("services.page.hero.supporting") as string}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services-authority" aria-labelledby="services-authority-heading" className="mt-12 md:mt-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 id="services-authority-heading" className="sr-only">
              {t("services.page.authority.h2") as string}
            </h2>
            <p
              className={cn(
                "text-sm sm:text-base md:text-lg text-muted-foreground/90",
                "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4",
                "shadow-[0_0_35px_rgba(56,189,248,0.25)]"
              )}
            >
              {t("services.page.authority.oneSentence") as string}
            </p>
          </div>
        </div>
      </section>

      <section ref={listRef} id="services-list" aria-labelledby="services-list-heading" className="mt-16 md:mt-20">
        <div className="container mx-auto px-6">
          <div
            className={cn(
              "max-w-4xl mx-auto text-center transition-all duration-700",
              isRTL && "text-right",
              listVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold mb-4" id="services-list-heading">
              {t("services.page.list.h2") as string}
            </h2>
          </div>

          <ul
            className={cn(
              "mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6",
              "motion-safe:[&>*]:transition-transform motion-safe:[&>*]:duration-300 motion-safe:[&>*]:will-change-transform",
              listVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {SERVICES.map((service) => {
              const label = t(`services.page.list.items.${service.key}.label`) as string
              const aria = t(`services.page.list.items.${service.key}.aria`) as string
              const Icon = service.icon

              return (
                <li key={service.key}>
                  <Link
                    to={routerTo(locale, service.href)}
                    aria-label={aria}
                    className={cn(
                      "group block glass-panel rounded-2xl px-5 py-4 h-full",
                      "border border-white/10 bg-white/5 backdrop-blur-2xl",
                      "hover:border-cyan-400/80 hover:bg-white/10",
                      "shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:shadow-[0_0_45px_rgba(56,189,248,0.35)]",
                      "transition-all duration-300 ease-out",
                      "motion-safe:hover:-translate-y-1"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                      </div>
                      <div className={cn("flex-1", isRTL && "text-right")}>
                        <span className="inline-flex items-center gap-2 text-sm font-medium tracking-tight">
                          <span className="text-foreground group-hover:text-primary transition-colors">{label}</span>
                          <span className="text-primary/70 group-hover:text-primary transition-transform group-hover:translate-x-0.5">
                            ↗
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section ref={audiencesRef} id="services-for-who" aria-labelledby="services-for-who-heading" className="mt-20 md:mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              id="services-for-who-heading"
              className={cn(
                "text-2xl md:text-3xl font-display font-semibold mb-6 text-center transition-all duration-700",
                isRTL && "text-right",
                audiencesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t("services.page.forWho.h2") as string}
            </h2>
            <ul
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5",
                isRTL && "text-right",
                "transition-all duration-700 delay-100",
                audiencesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {forWhoItems.map((item, idx) => (
                <li
                  key={`${item}-${idx}`}
                  className="glass-panel rounded-2xl px-5 py-4 border border-white/10 bg-white/5 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground/95">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={outcomesRef} id="services-outcomes" aria-labelledby="services-outcomes-heading" className="mt-20 md:mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              id="services-outcomes-heading"
              className={cn(
                "text-2xl md:text-3xl font-display font-semibold mb-6 text-center transition-all duration-700",
                isRTL && "text-right",
                outcomesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t("services.page.outcomes.h2") as string}
            </h2>
            <ul
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5",
                isRTL && "text-right",
                "transition-all duration-700 delay-100",
                outcomesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {outcomeItems.map((item, idx) => (
                <li
                  key={`${item}-${idx}`}
                  className="glass-panel rounded-2xl px-5 py-4 border border-white/10 bg-white/5 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground/95">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={ctaRef} id="services-cta" aria-labelledby="services-cta-heading" className="mt-20 md:mt-24">
        <div className="container mx-auto px-6">
          <div
            className={cn(
              "max-w-4xl mx-auto glass-panel rounded-3xl px-6 md:px-10 py-8 md:py-10",
              "border border-primary/40 bg-gradient-to-br from-primary/15 via-background/80 to-accent/15",
              "backdrop-blur-2xl text-center",
              "transition-all duration-700",
              ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <h2 id="services-cta-heading" className="text-2xl md:text-3xl font-display font-semibold mb-4">
              {t("services.page.cta.h2") as string}
            </h2>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={routerTo(locale, CTA_PRIMARY_HREF)}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full text-sm md:text-base font-semibold",
                  "bg-primary text-primary-foreground neon-glow",
                  "hover:bg-primary/90 transition-colors duration-200"
                )}
              >
                {t("services.page.cta.primary") as string}
              </a>

              <a
                href={routerTo(locale, CTA_SECONDARY_HREF)}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full text-sm md:text-base font-semibold",
                  "border border-primary/60 bg-background/70 text-foreground",
                  "hover:bg-primary/10 transition-colors duration-200"
                )}
              >
                {t("services.page.cta.secondary") as string}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef} id="services-faq" aria-labelledby="services-faq-heading" className="mt-20 md:mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              id="services-faq-heading"
              className={cn(
                "text-2xl md:text-3xl font-display font-semibold mb-6 text-center transition-all duration-700",
                isRTL && "text-right",
                faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t("services.page.faq.h2") as string}
            </h2>

            <div
              className={cn(
                "space-y-3 transition-all duration-700 delay-100",
                faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {faqItems.map((item, idx) => (
                <details
                  key={`${item.q}-${idx}`}
                  className="group glass-panel rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-5 md:py-4"
                >
                  <summary className={cn("flex items-center justify-between gap-4 cursor-pointer list-none", isRTL && "text-right")}>
                    <span className="text-sm md:text-base font-medium text-foreground">{item.q}</span>
                    <span
                      className="shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs text-muted-foreground group-open:rotate-90 transition-transform"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className={cn("mt-3 text-sm md:text-base text-muted-foreground/95", isRTL && "text-right")}>{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}