// src/seo/RouteSeo.tsx
import React from "react"
import { Helmet } from "react-helmet-async"
import { getRouteSEO, DEFAULT_SEO_KEYS, type Locale } from "@/seo/seoConfig"
import { useI18n } from "@/i18n/useI18n"

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || "").replace(/\/+$/, "")

type Props = {
  title?: string
  description?: string
  ogImage?: string
  indexable?: boolean
  canonical?: string
}

function getLocaleFromPath(pathname: string): Locale {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr"
  if (pathname === "/lb" || pathname.startsWith("/lb/")) return "lb"
  return "en"
}

function withLocalePrefix(locale: Locale, cleanPathname: string) {
  if (locale === "fr") return cleanPathname === "/" ? "/fr" : `/fr${cleanPathname}`
  if (locale === "lb") return cleanPathname === "/" ? "/lb" : `/lb${cleanPathname}`
  return cleanPathname
}

function hrefLangForOg(locale: Locale) {
  if (locale === "lb") return "ar-LB"
  if (locale === "fr") return "fr"
  return "en"
}

function htmlLangFor(locale: Locale) {
  if (locale === "lb") return "ar-LB"
  if (locale === "fr") return "fr"
  return "en"
}

function normalizePath(p: string) {
  if (!p) return "/"
  const s = String(p)
  if (!s.startsWith("/")) return `/${s}`
  return s
}

function stripHash(url: string) {
  const s = String(url || "")
  const i = s.indexOf("#")
  return i === -1 ? s : s.slice(0, i)
}

function stripViteBase(pathname: string) {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "")
  if (!base || base === "/") return pathname || "/"
  const p = String(pathname || "/")
  if (p.toLowerCase().startsWith(base.toLowerCase())) {
    const rest = p.slice(base.length)
    return rest ? (rest.startsWith("/") ? rest : `/${rest}`) : "/"
  }
  return p
}

function stripLocalePrefixFromPath(pathname: string) {
  const p = String(pathname || "/")
  const m = p.match(/^\/(fr|lb)(?=\/|$)/i)

  if (!m) {
    const normalized = normalizePath(p)
    if (normalized !== "/" && normalized.endsWith("/")) return normalized.replace(/\/+$/, "")
    return normalized
  }

  const prefix = `/${m[1].toLowerCase()}`
  const rest = p.slice(prefix.length) || "/"
  const normalized = normalizePath(rest)
  if (normalized !== "/" && normalized.endsWith("/")) return normalized.replace(/\/+$/, "")
  return normalized
}

function toAbsolutePath(path: string) {
  const origin = SITE_ORIGIN || (typeof window !== "undefined" ? window.location.origin : "")
  return `${origin}${normalizePath(path)}`
}

function normalizeToSiteOrigin(maybeAbsoluteOrPath: string) {
  const s = String(maybeAbsoluteOrPath || "").trim()
  if (!s) return ""
  if (s.startsWith("/")) return `${SITE_ORIGIN}${s}`
  if (s.startsWith("http://") || s.startsWith("https://")) {
    try {
      const u = new URL(s)
      return `${SITE_ORIGIN}${u.pathname}${u.search || ""}`
    } catch {
      return ""
    }
  }
  return ""
}

function isServicePath(cleanPathname: string) {
  const p = String(cleanPathname || "/")
  return p.startsWith("/services/") && p.split("/").filter(Boolean).length === 2
}

function isBlogPostPath(cleanPathname: string) {
  const p = String(cleanPathname || "/")
  return p.startsWith("/blog-post-")
}

type SchemaNode = Record<string, unknown>
type SchemaGraph = { "@context": "https://schema.org"; "@graph": SchemaNode[] }

function isPlainObject(v: JsonValue): v is { [key: string]: JsonValue } {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function jsonValueToString(v: JsonValue): string {
  if (typeof v === "string") return v
  return ""
}

function safeT(t: (key: string) => JsonValue, key: string) {
  const v = t(key)
  if (v == null) return ""
  if (typeof v === "string" && v === key) return ""
  return jsonValueToString(v)
}

function buildSchemaGraph(args: {
  t: (key: string) => JsonValue
  htmlLang: string
  canonicalUrl: string
  cleanPathname: string
  finalTitle: string
  finalDescription: string
  finalOgImage: string
}): SchemaGraph {
  const { t, htmlLang, canonicalUrl, cleanPathname, finalTitle, finalDescription, finalOgImage } = args

  const orgId = `${SITE_ORIGIN}/#organization`
  const websiteId = `${SITE_ORIGIN}/#website`

  const siteName = safeT(t, DEFAULT_SEO_KEYS.siteNameKey) || "Framework"

  const graph: SchemaNode[] = [
    {
      "@type": "Organization",
      "@id": orgId,
      url: `${SITE_ORIGIN}/`,
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: normalizeToSiteOrigin(finalOgImage) || finalOgImage,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_ORIGIN}/`,
      name: siteName,
      inLanguage: htmlLang,
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: finalTitle,
      description: finalDescription,
      inLanguage: htmlLang,
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
    },
  ]

  if (isServicePath(cleanPathname)) {
    graph.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      url: canonicalUrl,
      name: finalTitle,
      description: finalDescription,
      provider: { "@id": orgId },
      inLanguage: htmlLang,
    })
  } else if (isBlogPostPath(cleanPathname)) {
    graph.push({
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#blogposting`,
      mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
      url: canonicalUrl,
      headline: finalTitle,
      description: finalDescription,
      inLanguage: htmlLang,
      author: { "@id": orgId },
      publisher: { "@id": orgId },
      image: normalizeToSiteOrigin(finalOgImage) || finalOgImage,
    })
  }

  return { "@context": "https://schema.org", "@graph": graph }
}

export default function RouteSeo({ title, description, ogImage, indexable, canonical: canonicalOverride }: Props) {
  const { t } = useI18n()

  const rawPathname = typeof window !== "undefined" ? window.location.pathname : "/"
  const rawSearch = typeof window !== "undefined" ? window.location.search : ""

  const pathNoBase = stripViteBase(rawPathname)
  const locale = getLocaleFromPath(pathNoBase)
  const cleanPathname = stripLocalePrefixFromPath(pathNoBase)

  const routeSEO = getRouteSEO(cleanPathname, locale, rawSearch, t)
  const shouldIndex = indexable !== undefined ? indexable : routeSEO.indexable

  const finalTitle = title || routeSEO.title || safeT(t, DEFAULT_SEO_KEYS.titleKey) || ""
  const finalDescription = description || routeSEO.description || safeT(t, DEFAULT_SEO_KEYS.descriptionKey) || ""
  const finalOgImage = ogImage || routeSEO.ogImage || safeT(t, DEFAULT_SEO_KEYS.ogImageKey) || "/image.png"

  const localizedPath = withLocalePrefix(locale, cleanPathname)

  const canonicalFromConfig = canonicalOverride || routeSEO.canonical || localizedPath
  const canonicalUrlValue = stripHash(normalizeToSiteOrigin(canonicalFromConfig) || toAbsolutePath(localizedPath))

  const robotsContent = shouldIndex ? "index,follow" : "noindex,follow"
  const ogUrl = canonicalUrlValue

  const enUrl = toAbsolutePath(withLocalePrefix("en", cleanPathname))
  const frUrl = toAbsolutePath(withLocalePrefix("fr", cleanPathname))
  const lbUrl = toAbsolutePath(withLocalePrefix("lb", cleanPathname))

  const htmlLang = htmlLangFor(locale)
  const htmlDir = locale === "lb" ? "rtl" : "ltr"

  const siteName = safeT(t, DEFAULT_SEO_KEYS.siteNameKey) || "Framework"

  const schemaGraph = buildSchemaGraph({
    t,
    htmlLang,
    canonicalUrl: canonicalUrlValue,
    cleanPathname,
    finalTitle,
    finalDescription,
    finalOgImage,
  })

  return (
    <Helmet>
      <html lang={htmlLang} dir={htmlDir} />

      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrlValue} />

      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="ar-LB" href={lbUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={siteName} />

      <meta property="og:locale" content={hrefLangForOg(locale).replace("-", "_")} />
      <meta property="og:locale:alternate" content="en" />
      <meta property="og:locale:alternate" content="fr" />
      <meta property="og:locale:alternate" content="ar_LB" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      <script type="application/ld+json">{JSON.stringify(schemaGraph)}</script>
    </Helmet>
  )
}
