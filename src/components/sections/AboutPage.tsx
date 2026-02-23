// src/components/sections/AboutPage.tsx
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/useScrollReveal"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function withBase(path: string) {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path.startsWith("mailto:") || path.startsWith("tel:")) return path

  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  if (base && p.startsWith(`${base}/`)) return p
  return `${base}${p}`.replace(/\/{2,}/g, "/")
}

function localePrefix(locale: Props["locale"]) {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

function hrefFor(locale: Props["locale"], cleanPath: string) {
  const pref = localePrefix(locale)
  const p = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`
  return withBase(`${pref}${p}` || "/")
}

export function AboutPage({ locale, t }: Props) {
  const isRTL = locale === "lb"

  const differentIds = useMemo(() => ["a", "b", "c", "d"] as const, [])
  const standardsIds = useMemo(() => ["a", "b", "c", "d", "e"] as const, [])
  const chipsIds = useMemo(() => ["a", "b", "c", "d"] as const, [])

  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>(0.15)
  const { ref: diffRef, isVisible: diffVisible } = useScrollReveal<HTMLElement>(0.15)
  const { ref: responsibleRef, isVisible: responsibleVisible } = useScrollReveal<HTMLElement>(0.15)
  const { ref: standardsRef, isVisible: standardsVisible } = useScrollReveal<HTMLElement>(0.15)

  const reveal = (visible: boolean) =>
    cn(
      "transition-all duration-700 motion-reduce:transition-none",
      visible ? "opacity-100 translate-y-0" : "opacity-95 translate-y-1"
    )

  const textAlign = isRTL ? "text-right" : "text-left"
  const alignAuto = isRTL ? "ml-auto" : ""
  const dirClass = isRTL ? "rtl" : "ltr"

  return (
    <main className={cn("relative overflow-hidden bg-background", dirClass)} dir={isRTL ? "rtl" : "ltr"}>
      {/* Plain background */}
      <div className="pointer-events-none absolute inset-0 bg-background" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20 relative">
        <section ref={heroRef} aria-labelledby="about-h1" className={cn("relative", reveal(heroVisible))}>
          <header className="glass-panel rounded-3xl border border-white/10 backdrop-blur-2xl shadow-[0_0_70px_rgba(56,189,248,0.16)] overflow-hidden">
            <div className="relative p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <h1
                    id="about-h1"
                    className={cn(
                      "text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance text-[#28509E]",
                      textAlign
                    )}
                  >
                    <span>{t("about.hero.titlePrefix")}</span>{" "}
                    <span>{t("about.hero.titleAccent")}</span>
                    {t("about.hero.titleSuffix") ? <span> {t("about.hero.titleSuffix")}</span> : null}
                  </h1>

                  <p className={cn("mt-4 text-base md:text-lg text-muted-foreground max-w-2xl", textAlign, alignAuto)}>
                    {t("about.hero.description")}
                  </p>
                </div>
              </div>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
            </div>
          </header>
        </section>

        <section ref={diffRef} aria-labelledby="about-different-h2" className={cn("mt-12 md:mt-14", reveal(diffVisible))}>
          <div className="flex items-end justify-between gap-6">
            <h2 id="about-different-h2" className={cn("text-2xl md:text-3xl font-display font-semibold", textAlign)}>
              {t("about.sections.different.h2")}
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-7 glass-panel rounded-3xl p-7 border border-white/10 bg-white/5 card-depth">
              <h3 className={cn("text-base md:text-lg font-semibold", textAlign)}>{t("about.sections.different.items.a.h3")}</h3>
              <p className={cn("mt-3 text-sm md:text-base text-muted-foreground", textAlign)}>{t("about.sections.different.items.a.p")}</p>
            </div>

            <div className="lg:col-span-5 glass-panel rounded-3xl p-7 border border-white/10 bg-white/5 card-depth">
              <h3 className={cn("text-base md:text-lg font-semibold", textAlign)}>{t("about.sections.different.items.b.h3")}</h3>
              <p className={cn("mt-3 text-sm md:text-base text-muted-foreground", textAlign)}>{t("about.sections.different.items.b.p")}</p>
            </div>

            <div className="lg:col-span-5 glass-panel rounded-3xl p-7 border border-white/10 bg-white/5 card-depth">
              <h3 className={cn("text-base md:text-lg font-semibold", textAlign)}>{t("about.sections.different.items.c.h3")}</h3>
              <p className={cn("mt-3 text-sm md:text-base text-muted-foreground", textAlign)}>{t("about.sections.different.items.c.p")}</p>
            </div>

            <div className="lg:col-span-7 glass-panel rounded-3xl p-7 border border-white/10 bg-white/5 card-depth">
              <h3 className={cn("text-base md:text-lg font-semibold", textAlign)}>{t("about.sections.different.items.d.h3")}</h3>
              <p className={cn("mt-3 text-sm md:text-base text-muted-foreground", textAlign)}>{t("about.sections.different.items.d.p")}</p>
            </div>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: t("contact.schema.orgName"),
            url: t("contact.schema.url"),
            description: t("entity.definition"),
            email: t("contact.business.emailValue"),
            telephone: t("contact.business.phoneValue"),
            areaServed: t("contact.schema.areaServed")
          })
        }}
      />
    </main>
  )
}