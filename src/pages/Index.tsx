// src/pages/Index.tsx
import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Services } from "@/components/sections/Services"
import { ProcessTimeline } from "@/components/sections/ProcessTimeline"
import { FAQ } from "@/components/sections/FAQ"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/layout/Footer"

type IndexProps = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

export default function Index({ locale, t }: IndexProps) {
  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
     <Header
       locale={locale}
       t={t}
       brand={{
       name: "AchiDigital",
logoSrc: "AchiDigital.jpeg",
       logoAltKey: "header.brand.logoAlt",
      }}
      />


      <main>
        <Hero />
        <About />
        <ProcessTimeline />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
