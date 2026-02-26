import { useEffect } from "react"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { ProcessTimeline } from "@/components/sections/ProcessTimeline"
import { AiAssistant } from "@/components/sections/AiAssistant"
import { FAQ } from "@/components/sections/FAQ"
import { Contact } from "@/components/sections/Contact"

type IndexProps = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

export default function Index({ locale, t }: IndexProps) {
  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  return (
    <main>
      <Hero />
      <About t={t} />
      <ProcessTimeline />
      <AiAssistant locale={locale} />
      <FAQ locale={locale} t={t} />
      <Contact />
    </main>
  )
}