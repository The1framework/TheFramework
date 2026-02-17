// src/pages/About.tsx
import { PageLayout } from "@/components/layout/PageLayout"
import { AboutPage } from "@/components/sections/AboutPage"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

export default function About({ locale, t }: Props) {
  return (
    <PageLayout locale={locale} t={t}>
      <AboutPage locale={locale} t={t} />
    </PageLayout>
  )
}

