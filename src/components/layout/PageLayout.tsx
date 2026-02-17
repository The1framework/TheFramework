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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        locale={locale}
        t={t}
        brand={{
          name: "AchiDigital",
          logoSrc: "/AchiDigital.jpeg",
          logoAltKey: "header.brand.logoAlt"
        }}
      />

      <main>{children}</main>

      <Footer locale={locale} t={t} />
    </div>
  )
}
