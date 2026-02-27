// src/pages/ServiceSlug.tsx
import type { ReactNode } from "react"
import { useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ArrowRight, CheckCircle2, Sparkles, Layers3 } from "lucide-react"
import { NavLink } from "@/components/NavLink"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { buildPathWithLocale } from "@/utils/langRouting"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function parseLines(value: string) {
  return (value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseFaq(value: string) {
  return parseLines(value)
    .map((line) => {
      const [q, ...rest] = line.split("|")
      const a = rest.join("|")
      return { q: (q || "").trim(), a: (a || "").trim() }
    })
    .filter((x) => x.q && x.a)
}

function buildCanonical(siteUrl: string, locale: Props["locale"], path: string) {
  const normalizedSite = (siteUrl || "").replace(/\/$/, "")
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const localizedPath = buildPathWithLocale(locale, cleanPath)
  return `${normalizedSite}${localizedPath}`
}

function setOrCreateMeta(name: string, content: string) {
  if (!content) return
  const head = document.head
  const selector = `meta[name="${name}"]`
  let tag = head.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute("name", name)
    head.appendChild(tag)
  }
  tag.setAttribute("content", content)
}

function setOrCreateLink(rel: string, href: string) {
  if (!href) return
  const head = document.head
  const selector = `link[rel="${rel}"]`
  let tag = head.querySelector(selector) as HTMLLinkElement | null
  if (!tag) {
    tag = document.createElement("link")
    tag.setAttribute("rel", rel)
    head.appendChild(tag)
  }
  tag.setAttribute("href", href)
}

function upsertJsonLd(id: string, json: unknown) {
  const head = document.head
  const scriptId = `jsonld-${id}`
  let el = document.getElementById(scriptId) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement("script")
    el.type = "application/ld+json"
    el.id = scriptId
    head.appendChild(el)
  }
  el.text = JSON.stringify(json)
}

function removeJsonLd(id: string) {
  const scriptId = `jsonld-${id}`
  const el = document.getElementById(scriptId)
  if (el?.parentNode) el.parentNode.removeChild(el)
}

const SERVICE_SLUG_TO_KEY = {
  "full-stack": "fullStack",
  performance: "performance",
  "ux-ui": "uxui",
  seo: "seo",
  "geo-llm": "geo",
  aeo: "aeo",
  ppc: "ppc",
  content: "content",
  ecommerce: "ecommerce",
  "ai-automation": "aiAutomation",
} as const

type ServiceKey = (typeof SERVICE_SLUG_TO_KEY)[keyof typeof SERVICE_SLUG_TO_KEY]

const LEGACY_SLUG_TO_NEW = {
  "full-stack-web-app-development": "full-stack",
  "website-optimization-performance-engineering": "performance",
  "ux-ui-design-user-experience": "ux-ui",
  "geo-llm-search-optimization": "geo-llm",
  "answer-engine-optimization": "aeo",
  "paid-advertising-ppc": "ppc",
  "content-professional-writing": "content",
  "ecommerce-solutions": "ecommerce",
  "ai-integrations-automation": "ai-automation",
} as const

function BentoCard({
  icon,
  title,
  body,
  items,
  variant = "default",
}: {
  icon: ReactNode
  title: string
  body?: string
  items?: string[]
  variant?: "default" | "accent"
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-background/55 backdrop-blur-2xl p-6 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-['']",
        "before:bg-[radial-gradient(900px_circle_at_10%_10%,rgba(40,80,158,0.16),transparent_55%)]",
        "hover:before:opacity-100",
        variant === "accent" && "border-[rgba(40,80,158,0.35)]"
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[rgba(40,80,158,0.16)] blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-background/60 shadow-sm">
            <span className="text-[#28509E]">{icon}</span>
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {body ? <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p> : null}

        {items?.length ? (
          <ul className="mt-4 space-y-3">
            {items.slice(0, 10).map((x, idx) => (
              <li key={`${x}-${idx}`} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#28509E]" aria-hidden="true" />
                <span className="text-foreground">{x}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default function ServiceSlug({ locale, t }: Props) {
  const params = useParams<{ serviceSlug?: string }>()
  const rawSlug = (params.serviceSlug || "").trim()

  const lp = useCallback((path: string) => buildPathWithLocale(locale, path), [locale])

  const servicesHubPath = "/services"
  const contactPath = "/#contact"

  const resolved = useMemo(() => {
    const legacyTo = (LEGACY_SLUG_TO_NEW as Record<string, string>)[rawSlug]
    const canonicalSlug = legacyTo || rawSlug
    const key = (SERVICE_SLUG_TO_KEY as Record<string, ServiceKey | undefined>)[canonicalSlug]
    return {
      rawSlug,
      canonicalSlug,
      isLegacy: Boolean(legacyTo) && legacyTo !== rawSlug,
      key: key || null,
    }
  }, [rawSlug])

  const isFound = Boolean(resolved.key)
  const serviceKey = resolved.key

  const heroReveal = useScrollReveal<HTMLDivElement>(0.12)
  const contentReveal = useScrollReveal<HTMLDivElement>(0.12)
  const faqReveal = useScrollReveal<HTMLDivElement>(0.12)
  const convReveal = useScrollReveal<HTMLDivElement>(0.12)

  useEffect(() => {
    if (!resolved.isLegacy) return
    const target = lp(`/services/${resolved.canonicalSlug}`)
    if (window.location.pathname + window.location.search + window.location.hash !== target) {
      window.location.replace(target)
    }
  }, [resolved.isLegacy, resolved.canonicalSlug, lp])

  const siteUrl = (t("seo.siteUrl") as string) || ""
  const canonicalServicePath = `/services/${resolved.canonicalSlug}`
  const serviceKeyBase = serviceKey ? `services.single.items.${serviceKey}` : ""

  useEffect(() => {
    if (!isFound) {
      removeJsonLd(`service-${resolved.rawSlug}`)
      removeJsonLd(`service-${resolved.canonicalSlug}`)
    }

    if (!isFound) {
      document.title = t("services.single.notFound.metaTitle") as string
      setOrCreateMeta("description", t("services.single.notFound.metaDescription") as string)
      setOrCreateLink("canonical", buildCanonical(siteUrl, locale, servicesHubPath))
      return
    }

    const metaTitle = t(`${serviceKeyBase}.metaTitle`) as string
    const metaDescription = t(`${serviceKeyBase}.metaDescription`) as string

    document.title = metaTitle
    setOrCreateMeta("description", metaDescription)
    setOrCreateLink("canonical", buildCanonical(siteUrl, locale, canonicalServicePath))

    const orgName = t("seo.organization.name") as string
    const orgUrl = t("seo.organization.url") as string
    const orgLogo = t("seo.organization.logo") as string

    const serviceName = t(`${serviceKeyBase}.name`) as string
    const serviceDesc = t(`${serviceKeyBase}.schema.description`) as string
    const areaServed = parseLines(t(`${serviceKeyBase}.schema.areaServed`) as string)

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceName,
      description: serviceDesc,
      serviceType: serviceName,
      areaServed: areaServed.length ? areaServed.map((x) => ({ "@type": "AdministrativeArea", name: x })) : undefined,
      provider: {
        "@type": "Organization",
        name: orgName,
        url: orgUrl,
        logo: orgLogo,
      },
      url: buildCanonical(siteUrl, locale, canonicalServicePath),
    }

    upsertJsonLd(`service-${resolved.canonicalSlug}`, jsonLd)
  }, [
    isFound,
    serviceKeyBase,
    locale,
    siteUrl,
    servicesHubPath,
    canonicalServicePath,
    resolved.rawSlug,
    resolved.canonicalSlug,
    t,
  ])

  if (!isFound) {
    return (
      <main className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[980px] w-[980px] rounded-full bg-[rgba(40,80,158,0.14)] blur-3xl" />
          <div className="absolute top-24 left-8 h-72 w-72 rounded-full bg-[rgba(40,80,158,0.12)] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:18px_18px]" />
        </div>

        <section className="relative overflow-hidden pt-28 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <h1 className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl text-balance">
                {t("services.single.notFound.h1") as string}
              </h1>

              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {t("services.single.notFound.supporting") as string}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="hero" size="xl" className="btn-press group">
                  <NavLink to={lp(servicesHubPath)} aria-label={t("services.single.notFound.ctaPrimaryAria") as string}>
                    {t("services.single.notFound.ctaPrimaryLabel") as string}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </NavLink>
                </Button>

                <Button asChild variant="outline" size="xl" className="btn-press">
                  <NavLink to={lp("/")} aria-label={t("services.single.notFound.ctaSecondaryAria") as string}>
                    {t("services.single.notFound.ctaSecondaryLabel") as string}
                  </NavLink>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const serviceName = t(`${serviceKeyBase}.name`) as string
  const heroSupporting = t(`${serviceKeyBase}.hero.supporting`) as string

  const heroCtaSecondaryLabel = t(`${serviceKeyBase}.hero.ctaSecondaryLabel`) as string
  const heroCtaSecondaryAria = t(`${serviceKeyBase}.hero.ctaSecondaryAria`) as string
  const heroCtaSecondaryHref = lp(servicesHubPath)

  const trustItems = parseLines(t(`${serviceKeyBase}.hero.trustItems`) as string)

  const definitionTitle = t(`${serviceKeyBase}.definition.title`) as string
  const definitionBody = t(`${serviceKeyBase}.definition.body`) as string

  const includedTitle = t(`${serviceKeyBase}.included.title`) as string
  const includedItems = parseLines(t(`${serviceKeyBase}.included.items`) as string)

  const faqTitle = t(`${serviceKeyBase}.faq.title`) as string
  const faqItems = parseFaq(t(`${serviceKeyBase}.faq.items`) as string)

  const conversionTitle = t(`${serviceKeyBase}.conversion.title`) as string
  const conversionSupporting = t(`${serviceKeyBase}.conversion.supporting`) as string
  const conversionPrimaryLabel = t(`${serviceKeyBase}.conversion.ctaPrimaryLabel`) as string
  const conversionPrimaryAria = t(`${serviceKeyBase}.conversion.ctaPrimaryAria`) as string
  const conversionPrimaryHref = lp(contactPath)
  const conversionSecondaryLabel = t(`${serviceKeyBase}.conversion.ctaSecondaryLabel`) as string
  const conversionSecondaryAria = t(`${serviceKeyBase}.conversion.ctaSecondaryAria`) as string
  const conversionSecondaryHref = lp(servicesHubPath)

  const trustAria = t(`${serviceKeyBase}.hero.trustAria`) as string

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 h-[1040px] w-[1040px] rounded-full bg-[rgba(40,80,158,0.16)] blur-3xl fx-float-slow" />
        <div className="absolute top-24 left-8 h-72 w-72 rounded-full bg-[rgba(40,80,158,0.12)] blur-3xl fx-float" />
        <div className="absolute bottom-[-140px] right-[-80px] h-[560px] w-[560px] rounded-full bg-[rgba(40,80,158,0.14)] blur-3xl fx-float-slower" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:18px_18px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(40,80,158,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,80,158,0.18)_1px,transparent_1px)] [background-size:84px_84px]" />
      </div>

      <section className="relative pt-24 pb-10">
        <div className="container mx-auto px-6">
          <div
            ref={heroReveal.ref}
            className={cn(
              "transition-all duration-700 motion-safe:will-change-transform",
              heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h1 className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl text-balance">
              <span className="relative inline-block">
                <span className="relative z-10">{serviceName}</span>
                <span
                  className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[28px] bg-[radial-gradient(900px_circle_at_10%_10%,rgba(40,80,158,0.22),transparent_55%)] blur-2xl"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">{heroSupporting}</p>

            {trustItems.length ? (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label={trustAria || undefined}>
                {trustItems.slice(0, 3).map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-border/60 bg-background/55 backdrop-blur-2xl p-4 shadow-sm transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-lg"
                    )}
                  >
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[rgba(40,80,158,0.18)] blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
                    <div className="relative flex items-start gap-3">
                      <p className="text-sm text-foreground leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={contentReveal.ref}
            className={cn(
              "transition-all duration-700",
              contentReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <BentoCard
                  icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
                  title={definitionTitle}
                  body={definitionBody}
                  variant="accent"
                />
              </div>

              <div className="lg:col-span-5">
                <BentoCard icon={<Layers3 className="h-5 w-5" aria-hidden="true" />} title={includedTitle} items={includedItems} />
              </div>
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {faqItems.length ? (
        <section className="py-10">
          <div className="container mx-auto px-6">
            <div
              ref={faqReveal.ref}
              className={cn(
                "rounded-3xl border border-border/60 bg-background/55 backdrop-blur-2xl p-6 md:p-8 shadow-sm transition-all duration-700",
                faqReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-background/60 shadow-sm">
                  <span className="text-[#28509E]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold">{faqTitle}</h2>
              </div>

              <div className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.slice(0, 8).map((f, idx) => (
                    <AccordionItem key={`${f.q}-${idx}`} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-14">
        <div className="container mx-auto px-6">
          <div
            ref={convReveal.ref}
            className={cn(
              "relative overflow-hidden rounded-[30px] border border-border/60 bg-background/55 backdrop-blur-2xl p-8 md:p-10 shadow-sm transition-all duration-700",
              convReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[820px] w-[820px] rounded-full bg-[rgba(40,80,158,0.18)] blur-3xl fx-float-slow" />
              <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:16px_16px]" />
              <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(90deg,rgba(40,80,158,0.18),transparent_35%,rgba(40,80,158,0.14))] fx-scan" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">{conversionTitle}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{conversionSupporting}</p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="hero" size="xl" className="btn-press group">
                    <NavLink to={conversionPrimaryHref} aria-label={conversionPrimaryAria}>
                      {conversionPrimaryLabel}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </NavLink>
                  </Button>

                  <Button asChild variant="outline" size="xl" className="btn-press">
                    <NavLink to={conversionSecondaryHref} aria-label={conversionSecondaryAria}>
                      {conversionSecondaryLabel}
                    </NavLink>
                  </Button>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/60 bg-background/55 backdrop-blur-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#28509E]" />
                  <span className="text-sm font-semibold">{t("services.single.conversion.sideTitle") as string}</span>
                </div>

                <div className="mt-4 space-y-3">
                  {parseLines(t(`${serviceKeyBase}.conversion.sideBullets`) as string)
                    .slice(0, 5)
                    .map((x, idx) => (
                      <div
                        key={`${x}-${idx}`}
                        className={cn(
                          "group relative overflow-hidden rounded-3xl border border-border/60 bg-background/40 px-4 py-4 shadow-sm transition-all duration-300",
                          "hover:-translate-y-1 hover:shadow-lg hover:border-[rgba(40,80,158,0.35)]"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(900px_circle_at_10%_10%,rgba(40,80,158,0.16),transparent_55%)]" />
                        <div className="relative flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#28509E]" aria-hidden="true" />
                          <p className="text-sm text-foreground leading-relaxed">{x}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </section>
    </main>
  )
}