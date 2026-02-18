// src/pages/ServiceSlug.tsx
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { buildPathWithLocale } from "@/utils/langRouting"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

/**
 * IMPORTANT:
 * - NO hard-coded English UI text in this file.
 * - All headings/paragraphs/bullets/FAQ/meta/schema come from JSON via t().
 * - Lists are stored as newline-separated strings in JSON and parsed here.
 * - Slugs are SHORT and stable. Display names live in JSON.
 * - Legacy long slugs can be supported and canonicalized to the short slug.
 */

function parseLines(value: string) {
  return (value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parsePairs(value: string) {
  // Each line: "slug|label"
  return parseLines(value)
    .map((line) => {
      const [left, ...rest] = line.split("|")
      const right = rest.join("|")
      return { slug: (left || "").trim(), label: (right || "").trim() }
    })
    .filter((x) => x.slug && x.label)
}

function parseFaq(value: string) {
  // Each line: "Question|Answer"
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
  // Your utils signature is: buildPathWithLocale(locale, path)
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
  // ✅ short, stable slugs (recommended)
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
  // ✅ legacy long slugs → canonical short slug
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

export default function ServiceSlug({ locale, t }: Props) {
  const params = useParams<{ serviceSlug?: string }>()
  const rawSlug = (params.serviceSlug || "").trim()

  // Localized path builder (fixes TS errors by keeping signature consistent)
  const lp = (path: string) => buildPathWithLocale(locale, path)

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

  // ✅ Hooks MUST be called unconditionally (same order every render)
  const heroReveal = useScrollReveal<HTMLDivElement>(0.12)
  const defReveal = useScrollReveal<HTMLDivElement>(0.12)
  const forReveal = useScrollReveal<HTMLDivElement>(0.12)
  const probReveal = useScrollReveal<HTMLDivElement>(0.12)
  const apprReveal = useScrollReveal<HTMLDivElement>(0.12)
  const inclReveal = useScrollReveal<HTMLDivElement>(0.12)
  const benReveal = useScrollReveal<HTMLDivElement>(0.12)
  const useReveal = useScrollReveal<HTMLDivElement>(0.12)
  const stratReveal = useScrollReveal<HTMLDivElement>(0.12)
  const stdReveal = useScrollReveal<HTMLDivElement>(0.12)
  const fitReveal = useScrollReveal<HTMLDivElement>(0.12)
  const faqReveal = useScrollReveal<HTMLDivElement>(0.12)
  const convReveal = useScrollReveal<HTMLDivElement>(0.12)

  // ✅ If user hits legacy slug, redirect to new short slug (no loops)
  useEffect(() => {
    if (!resolved.isLegacy) return
    const target = lp(`/services/${resolved.canonicalSlug}`)
    // Keep it simple + safe for SPA
    if (window.location.pathname + window.location.search + window.location.hash !== target) {
      window.location.replace(target)
    }
  }, [resolved.isLegacy, resolved.canonicalSlug, locale])

  const siteUrl = (t("seo.siteUrl") as string) || ""
  const canonicalServicePath = `/services/${resolved.canonicalSlug}`

  const serviceKeyBase = serviceKey ? `services.single.items.${serviceKey}` : ""

  // --- SEO Head (title, meta, canonical, schema) ---
  useEffect(() => {
    // Clean up old service JSON-LD script if navigating between pages
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

    // ✅ Canonical ALWAYS points to the short slug
    setOrCreateLink("canonical", buildCanonical(siteUrl, locale, canonicalServicePath))

    // Service JSON-LD (from JSON keys only)
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
      areaServed: areaServed.length
        ? areaServed.map((x) => ({ "@type": "AdministrativeArea", name: x }))
        : undefined,
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

  // --- Not found UX (translated) ---
  if (!isFound) {
    return (
      <main className="relative">
        <section className="relative overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-background" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[920px] h-[920px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-24 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-sm text-muted-foreground">
                <a className="inline-flex items-center gap-1 hover:underline" href={lp(servicesHubPath)}>
                  {t("services.single.notFound.breadcrumbServices") as string}
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </p>

              <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                {t("services.single.notFound.h1") as string}
              </h1>

              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {t("services.single.notFound.supporting") as string}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="hero" size="xl" className="btn-press group">
                  <a href={lp(servicesHubPath)} aria-label={t("services.single.notFound.ctaPrimaryAria") as string}>
                    {t("services.single.notFound.ctaPrimaryLabel") as string}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="xl" className="btn-press">
                  <a href={lp("/")} aria-label={t("services.single.notFound.ctaSecondaryAria") as string}>
                    {t("services.single.notFound.ctaSecondaryLabel") as string}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // --- Data from JSON (strings only -> parsed) ---
  const serviceName = t(`${serviceKeyBase}.name`) as string

  const heroSupporting = t(`${serviceKeyBase}.hero.supporting`) as string
  const heroCtaPrimaryLabel = t(`${serviceKeyBase}.hero.ctaPrimaryLabel`) as string
  const heroCtaPrimaryAria = t(`${serviceKeyBase}.hero.ctaPrimaryAria`) as string
  const heroCtaPrimaryHref = lp(contactPath)

  const heroCtaSecondaryLabel = t(`${serviceKeyBase}.hero.ctaSecondaryLabel`) as string
  const heroCtaSecondaryAria = t(`${serviceKeyBase}.hero.ctaSecondaryAria`) as string
  const heroCtaSecondaryHref = lp(servicesHubPath)

  const definitionTitle = t(`${serviceKeyBase}.definition.title`) as string
  const definitionBody = t(`${serviceKeyBase}.definition.body`) as string

  const forTitle = t(`${serviceKeyBase}.for.title`) as string
  const forItems = parseLines(t(`${serviceKeyBase}.for.items`) as string)

  const problemTitle = t(`${serviceKeyBase}.problem.title`) as string
  const problemBody = t(`${serviceKeyBase}.problem.body`) as string

  const approachTitle = t(`${serviceKeyBase}.approach.title`) as string
  const approachBody = t(`${serviceKeyBase}.approach.body`) as string

  const includedTitle = t(`${serviceKeyBase}.included.title`) as string
  const includedItems = parseLines(t(`${serviceKeyBase}.included.items`) as string)

  const benefitsTitle = t(`${serviceKeyBase}.benefits.title`) as string
  const benefitsItems = parseLines(t(`${serviceKeyBase}.benefits.items`) as string)

  const useCasesTitle = t(`${serviceKeyBase}.useCases.title`) as string
  const useCasesItems = parseLines(t(`${serviceKeyBase}.useCases.items`) as string)

  const strategyTitle = t(`${serviceKeyBase}.strategy.title`) as string
  const strategyBody = t(`${serviceKeyBase}.strategy.body`) as string
  const relatedLinksTitle = t(`${serviceKeyBase}.strategy.relatedLinksTitle`) as string
  const relatedLinks = parsePairs(t(`${serviceKeyBase}.strategy.relatedLinks`) as string)

  const standardsTitle = t(`${serviceKeyBase}.standards.title`) as string
  const standardsItems = parseLines(t(`${serviceKeyBase}.standards.items`) as string)

  const fitTitle = t(`${serviceKeyBase}.fit.title`) as string
  const fitYesTitle = t(`${serviceKeyBase}.fit.yesTitle`) as string
  const fitYesItems = parseLines(t(`${serviceKeyBase}.fit.yesItems`) as string)
  const fitNoTitle = t(`${serviceKeyBase}.fit.noTitle`) as string
  const fitNoItems = parseLines(t(`${serviceKeyBase}.fit.noItems`) as string)

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

  return (
    <main className="relative">
      {/* Futuristic background (visual-only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[980px] h-[980px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-24 left-8 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-60px] w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:20px_20px]" />
      </div>

      {/* Breadcrumb */}
      <section className="pt-24">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-muted-foreground" aria-label={t("services.single.breadcrumb.aria") as string}>
            <a className="hover:underline" href={lp(servicesHubPath)}>
              {t("services.single.breadcrumb.servicesHub") as string}
            </a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{serviceName}</span>
          </nav>
        </div>
      </section>

      {/* 1) HERO */}
      <section className="relative pt-8 pb-10">
        <div className="container mx-auto px-6">
          <div
            ref={heroReveal.ref}
            className={cn(
              "max-w-3xl transition-all duration-700 motion-safe:will-change-transform",
              heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* ONE H1 ONLY */}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
                  {serviceName}
                </span>
                <span className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" aria-hidden="true" />
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-muted-foreground">{heroSupporting}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="xl" className="btn-press group">
                <a href={heroCtaPrimaryHref} aria-label={heroCtaPrimaryAria}>
                  {heroCtaPrimaryLabel}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="btn-press">
                <a href={heroCtaSecondaryHref} aria-label={heroCtaSecondaryAria}>
                  {heroCtaSecondaryLabel}
                </a>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {parseLines(t(`${serviceKeyBase}.hero.trustItems`) as string)
                .slice(0, 3)
                .map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-md px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* 2) DEFINITION */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={defReveal.ref}
            className={cn(
              "rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 md:p-8 shadow-sm transition-all duration-700",
              defReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{definitionTitle}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{definitionBody}</p>
          </div>
        </div>
      </section>

      {/* 3) WHO IT’S FOR */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={forReveal.ref}
            className={cn("transition-all duration-700", forReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{forTitle}</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {forItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="rounded-2xl border border-border/60 bg-background/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                    <p className="text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 4) PROBLEM */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={probReveal.ref}
            className={cn(
              "rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 md:p-8 shadow-sm transition-all duration-700",
              probReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{problemTitle}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{problemBody}</p>
          </div>
        </div>
      </section>

      {/* 5) APPROACH */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={apprReveal.ref}
            className={cn("transition-all duration-700", apprReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{approachTitle}</h2>

            <div className="mt-6 rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 md:p-8 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">{approachBody}</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {parseLines(t(`${serviceKeyBase}.approach.pillars`) as string)
                  .slice(0, 3)
                  .map((p, idx) => (
                    <div key={`${p}-${idx}`} className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
                        <span className="text-foreground">{p}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 6) INCLUDED */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={inclReveal.ref}
            className={cn("transition-all duration-700", inclReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{includedTitle}</h2>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {includedItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                    <p className="text-foreground">{item}</p>
                  </div>

                  <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                  <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
                    {t(`${serviceKeyBase}.included.note`) as string}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 7) BENEFITS */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={benReveal.ref}
            className={cn("transition-all duration-700", benReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{benefitsTitle}</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="rounded-2xl border border-border/60 bg-background/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                    <p className="text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 8) USE CASES */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={useReveal.ref}
            className={cn("transition-all duration-700", useReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{useCasesTitle}</h2>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {useCasesItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 9) STRATEGY FIT */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={stratReveal.ref}
            className={cn(
              "rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 md:p-8 shadow-sm transition-all duration-700",
              stratReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{strategyTitle}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{strategyBody}</p>

            <div className="mt-8">
              <h3 className="text-base font-semibold">{relatedLinksTitle}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedLinks.slice(0, 3).map((l) => (
                  <a
                    key={l.slug}
                    href={lp(`/services/${l.slug}`)}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-sm hover:bg-background/60 transition"
                    aria-label={t("services.single.related.aria") as string}
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10) STANDARDS */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={stdReveal.ref}
            className={cn("transition-all duration-700", stdReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{standardsTitle}</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {standardsItems.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className="rounded-2xl border border-border/60 bg-background/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                    <p className="text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 11) IS IT RIGHT FOR YOU */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={fitReveal.ref}
            className={cn("transition-all duration-700", fitReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{fitTitle}</h2>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{fitYesTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {fitYesItems.map((x, idx) => (
                    <li key={`${x}-${idx}`} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                      <span className="text-foreground">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{fitNoTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {fitNoItems.map((x, idx) => (
                    <li key={`${x}-${idx}`} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                      <span className="text-foreground">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* 12) FAQ */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div
            ref={faqReveal.ref}
            className={cn(
              "rounded-3xl border border-border/60 bg-background/50 backdrop-blur-xl p-6 md:p-8 shadow-sm transition-all duration-700",
              faqReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">{faqTitle}</h2>

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

      {/* 13) CONVERSION */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div
            ref={convReveal.ref}
            className={cn(
              "relative overflow-hidden rounded-[28px] border border-border/60 bg-background/55 backdrop-blur-2xl p-8 md:p-10 shadow-sm transition-all duration-700",
              convReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-primary/12 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:18px_18px]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold">{conversionTitle}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{conversionSupporting}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="hero" size="xl" className="btn-press group">
                <a href={conversionPrimaryHref} aria-label={conversionPrimaryAria}>
                  {conversionPrimaryLabel}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="btn-press">
                <a href={conversionSecondaryHref} aria-label={conversionSecondaryAria}>
                  {conversionSecondaryLabel}
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {parseLines(t(`${serviceKeyBase}.conversion.trust`) as string)
                .slice(0, 4)
                .map((x, idx) => (
                  <span
                    key={`${x}-${idx}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-foreground">{x}</span>
                  </span>
                ))}
            </div>
          </div>

          <div className="h-10" />
        </div>
      </section>
    </main>
  )
}
