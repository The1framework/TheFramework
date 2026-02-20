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
    name: (t("seo.organization.name") as string) || "Framework",
    logoSrc: (t("header.brand.logoSrc") as string) || undefined,
    logoAltKey: "header.brand.logoAlt",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header locale={locale} t={t} brand={brand} />
      <main>{children}</main>
      <Footer locale={locale} t={t} />
    </div>
  )
}
