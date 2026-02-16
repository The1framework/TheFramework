// src/pages/ServiceSlug.tsx
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import NotFound from "./NotFound"
import { cn } from "@/lib/utils"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function withBase(path: string) {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
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

function hrefFor(locale: Props["locale"], path: string) {
  const pref = localePrefix(locale)
  const p = path.startsWith("/") ? path : `/${path}`
  return withBase(`${pref}${p}` || "/")
}

const ALLOWED_SLUGS = [
  "ai-website-development",
  "seo",
  "geo-llm-search-optimization",
  "answer-engine-optimization",
  "ai-integrations-automation",
] as const

type AllowedSlug = (typeof ALLOWED_SLUGS)[number]

function isAllowedSlug(v: string | undefined): v is AllowedSlug {
  return !!v && (ALLOWED_SLUGS as readonly string[]).includes(v)
}

export default function ServiceSlug({ locale, t }: Props) {
  const params = useParams()
  const serviceSlug = params.serviceSlug

  if (!isAllowedSlug(serviceSlug)) {
    return <NotFound />
  }

  const baseKey = `servicePages.${serviceSlug}`

  const related = useMemo(
    () =>
      (t(`${baseKey}.related.items`) ? ALLOWED_SLUGS : ALLOWED_SLUGS)
        .filter((s) => s !== serviceSlug)
        .slice(0, 5),
    [serviceSlug, t, baseKey]
  )

  return (
    <main className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full blur-3xl bg-primary/20" />
        <div className="absolute -bottom-24 left-1/3 h-[520px] w-[920px] rounded-full blur-3xl bg-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16">
        {/* H1 (only one) */}
        <header className="glass-panel rounded-3xl p-8 md:p-10">
          <p className="text-sm text-muted-foreground">{t(`${baseKey}.hero.kicker`)}</p>

          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
            {t(`${baseKey}.h1`)}
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
            {t(`${baseKey}.hero.subtitle`)}
          </p>

          <div className="mt-6 space-y-3 text-muted-foreground max-w-3xl">
            <p>{t(`${baseKey}.hero.p1`)}</p>
            <p>{t(`${baseKey}.hero.p2`)}</p>
            <p>{t(`${baseKey}.hero.p3`)}</p>
          </div>
        </header>

        {/* Sections */}
        {["problem", "approach", "whatIs", "whyDifferent", "capabilities", "process", "results"].map((sectionKey) => (
          <section key={sectionKey} className="mt-10">
            <div className="glass-panel rounded-3xl p-7 md:p-9">
              <h2 className="text-xl md:text-2xl font-semibold">{t(`${baseKey}.${sectionKey}.h2`)}</h2>

              {t(`${baseKey}.${sectionKey}.p`) ? (
                <p className="mt-3 text-muted-foreground max-w-4xl">{t(`${baseKey}.${sectionKey}.p`)}</p>
              ) : null}

              {/* optional sub-paragraphs */}
              {["p1", "p2"].map((pkey) =>
                t(`${baseKey}.${sectionKey}.${pkey}`) ? (
                  <p key={pkey} className="mt-3 text-muted-foreground max-w-4xl">
                    {t(`${baseKey}.${sectionKey}.${pkey}`)}
                  </p>
                ) : null
              )}

              {/* list */}
              <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3" role="list">
                {[...Array(12)].map((_, i) => {
                  const itemKey = `${baseKey}.${sectionKey}.items.${i + 1}`
                  const value = t(itemKey)
                  if (!value || value === itemKey) return null
                  return (
                    <li key={itemKey} className="rounded-2xl border border-white/10 bg-muted/10 px-5 py-4">
                      <span className="text-foreground font-medium">{value}</span>
                    </li>
                  )
                })}
              </ul>

              {/* optional highlighted blocks */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {["a", "b", "c", "d", "e"].map((k) => {
                  const titleKey = `${baseKey}.${sectionKey}.blocks.${k}.title`
                  const bodyKey = `${baseKey}.${sectionKey}.blocks.${k}.body`
                  const title = t(titleKey)
                  const body = t(bodyKey)
                  if (!title || title === titleKey) return null
                  return (
                    <div key={k} className={cn("rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-5")}>
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      {body && body !== bodyKey ? <p className="mt-2 text-sm text-muted-foreground">{body}</p> : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ))}

        {/* Related services */}
        <section className="mt-12 glass-panel rounded-3xl p-7 md:p-10">
          <h2 className="text-xl md:text-2xl font-semibold">{t(`${baseKey}.related.h2`)}</h2>

          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {related.map((slug) => (
              <li key={slug}>
                <a
                  href={hrefFor(locale, `/services/${slug}`)}
                  className="block rounded-2xl border border-white/15 bg-background/40 backdrop-blur-xl px-5 py-4 hover:border-white/25 transition-colors"
                >
                  <span className="font-semibold text-foreground">{t(`servicesIndex.items.${slug}`)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Final CTA */}
        <section className="mt-12 glass-panel rounded-3xl p-7 md:p-10">
          <h2 className="text-xl md:text-2xl font-semibold">{t(`${baseKey}.finalCta.h2`)}</h2>
          <div className="mt-3 space-y-2 text-muted-foreground max-w-3xl">
            <p>{t(`${baseKey}.finalCta.p1`)}</p>
            <p>{t(`${baseKey}.finalCta.p2`)}</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={hrefFor(locale, "/contact")}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-primary text-primary-foreground font-semibold neon-glow hover:opacity-95 transition-opacity"
            >
              {t(`${baseKey}.finalCta.primary`)}
            </a>

            <a
              href={hrefFor(locale, "/services")}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-white/15 bg-background/40 backdrop-blur-xl font-semibold text-foreground hover:border-white/25 transition-colors"
            >
              {t(`${baseKey}.finalCta.secondary`)}
            </a>
          </div>
        </section>
      </section>
    </main>
  )
}
