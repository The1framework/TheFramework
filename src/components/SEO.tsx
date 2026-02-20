import React from "react"
import RouteSeo from "@/seo/RouteSeo"

export type SeoProps = {
  title?: string
  description?: string
  canonical?: string
  robots?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  noindex?: boolean
  jsonLd?: unknown
  indexable?: boolean
}

export default function SEO(props: SeoProps) {
  return <RouteSeo {...props} />
}
