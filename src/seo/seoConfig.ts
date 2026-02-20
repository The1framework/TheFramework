// src/seo/seoConfig.ts
import { hasFilterParams } from "@/seo/urlUtils"

export type Locale = "en" | "fr" | "lb"

type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export type RouteSeoData = {
  title: string
  description: string
  ogImage: string
  canonical: string
  indexable: boolean
}

type TFn = (key: string) => JsonValue

type SeoKeyPair = {
  titleKey: string
  descriptionKey: string
  ogImageKey?: string
  canonical?: string
  indexable?: boolean
}

type RouteSeoConfigEntry = {
  indexable?: boolean
  en?: SeoKeyPair
  fr?: SeoKeyPair
  lb?: SeoKeyPair
}

export const DEFAULT_SEO_KEYS = {
  siteNameKey: "seo.siteName",
  titleKey: "seo.defaults.title",
  descriptionKey: "seo.defaults.description",
  ogImageKey: "seo.defaults.ogImage",
} as const

export const NOINDEX_PATTERNS: RegExp[] = [
  /^\/admin/,
  /^\/login/,
  /^\/dashboard/,
  /^\/cart/,
  /^\/checkout/,
  /^\/thank-you/,
]

const ROUTE_SEO_CONFIG: Record<string, RouteSeoConfigEntry> = {
  "/": {
    indexable: true,
    en: { titleKey: "seo.routes.home.title", descriptionKey: "seo.routes.home.description" },
    fr: { titleKey: "seo.routes.home.title", descriptionKey: "seo.routes.home.description" },
    lb: { titleKey: "seo.routes.home.title", descriptionKey: "seo.routes.home.description" },
  },
  "/about": {
    indexable: true,
    en: { titleKey: "seo.routes.about.title", descriptionKey: "seo.routes.about.description" },
    fr: { titleKey: "seo.routes.about.title", descriptionKey: "seo.routes.about.description" },
    lb: { titleKey: "seo.routes.about.title", descriptionKey: "seo.routes.about.description" },
  },
  "/services": {
    indexable: true,
    en: { titleKey: "seo.routes.services.title", descriptionKey: "seo.routes.services.description" },
    fr: { titleKey: "seo.routes.services.title", descriptionKey: "seo.routes.services.description" },
    lb: { titleKey: "seo.routes.services.title", descriptionKey: "seo.routes.services.description" },
  },
  "/technologies": {
    indexable: true,
    en: { titleKey: "seo.routes.technologies.title", descriptionKey: "seo.routes.technologies.description" },
    fr: { titleKey: "seo.routes.technologies.title", descriptionKey: "seo.routes.technologies.description" },
    lb: { titleKey: "seo.routes.technologies.title", descriptionKey: "seo.routes.technologies.description" },
  },
  "/contact": {
    indexable: true,
    en: { titleKey: "seo.routes.contact.title", descriptionKey: "seo.routes.contact.description" },
    fr: { titleKey: "seo.routes.contact.title", descriptionKey: "seo.routes.contact.description" },
    lb: { titleKey: "seo.routes.contact.title", descriptionKey: "seo.routes.contact.description" },
  },
}

function jsonValueToString(v: JsonValue): string {
  return typeof v === "string" ? v : ""
}

function safeT(t: TFn, key: string): string {
  const v = t(key)
  if (v == null) return ""
  if (typeof v === "string" && v === key) return ""
  return jsonValueToString(v)
}

export function isRouteIndexable(pathname: string, search = "") {
  for (const pattern of NOINDEX_PATTERNS) {
    if (pattern.test(pathname)) return false
  }
  if (hasFilterParams(pathname + search)) return false

  const routeConfig = ROUTE_SEO_CONFIG[pathname]
  if (!routeConfig) return true

  if (routeConfig.indexable === false) return false
  return true
}

export function getRouteSEO(pathname: string, locale: Locale, search: string, t: TFn): RouteSeoData {
  const defaultsTitle = safeT(t, DEFAULT_SEO_KEYS.titleKey)
  const defaultsDesc = safeT(t, DEFAULT_SEO_KEYS.descriptionKey)
  const defaultsOg = safeT(t, DEFAULT_SEO_KEYS.ogImageKey) || "/image.png"

  // Support slug pages: /services/:slug
  if (pathname.startsWith("/services/")) {
    const slug = pathname.split("/").filter(Boolean)[1] || ""

    const slugTitleKey = `seo.routes.serviceSlugs.${slug}.title`
    const slugDescKey = `seo.routes.serviceSlugs.${slug}.description`

    const title = safeT(t, slugTitleKey) || safeT(t, "seo.routes.serviceGeneric.title") || defaultsTitle
    const description =
      safeT(t, slugDescKey) || safeT(t, "seo.routes.serviceGeneric.description") || defaultsDesc

    return {
      title,
      description,
      ogImage: defaultsOg,
      canonical: "",
      indexable: isRouteIndexable(pathname, search),
    }
  }

  const entry = ROUTE_SEO_CONFIG[pathname]
  if (!entry) {
    return {
      title: defaultsTitle,
      description: defaultsDesc,
      ogImage: defaultsOg,
      canonical: "",
      indexable: isRouteIndexable(pathname, search),
    }
  }

  const pair = entry[locale] || entry.en
  const title = (pair ? safeT(t, pair.titleKey) : "") || defaultsTitle
  const description = (pair ? safeT(t, pair.descriptionKey) : "") || defaultsDesc

  const indexable =
    entry.indexable === false ? false : pair?.indexable === false ? false : isRouteIndexable(pathname, search)

  return {
    title,
    description,
    ogImage: defaultsOg,
    canonical: pair?.canonical || "",
    indexable,
  }
}
