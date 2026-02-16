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
    <>
      <Header
        locale={locale}
        t={t}
        brand={{
          name: "ACHIdigital",
          logoSrc: "/AchiDigital.jpeg",
          logoAltKey: "header.brand.logoAlt",
        }}
      />

      {children}

      <Footer locale={locale} t={t} />
    </>
  )
}
