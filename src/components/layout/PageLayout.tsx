// src/components/layout/PageLayout.tsx
import type { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
  children: ReactNode
}

export function PageLayout({ locale, t, children }: Props) {
  const brand = {
    name: "The Framework",
    logoSrc: "/logo.png",
    logoAltKey: "header.brand.logoAlt",
    homeHref: "/",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header locale={locale} t={t} brand={brand} />
      <main>{children}</main>
      <Footer locale={locale} t={t} />
    </div>
  )
}