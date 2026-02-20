// src/pages/About.tsx
import { AboutPage } from "@/components/sections/AboutPage"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

export default function About({ locale, t }: Props) {
  return <AboutPage locale={locale} t={t} />
}