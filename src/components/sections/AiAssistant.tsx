import React, { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/useI18n"
import { tString } from "@/i18n/ts"
import { buildPathWithLocale } from "@/utils/langRouting"

type Props = {
  locale: "en" | "fr" | "lb"
}

export function AiAssistant({ locale }: Props) {
  const { t } = useI18n()
  const ts = useCallback((key: string) => tString(t, key), [t])

  const faqHref = buildPathWithLocale(locale, "/#faq")
  const servicesHref = buildPathWithLocale(locale, "/services")

  return (
    <section
      className="py-20 relative"
      aria-label={ts("chatbot.homeSection.kicker")}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl border bg-muted/20 backdrop-blur-xl p-10 md:p-12 shadow-xl">

          {/* subtle gradient accent */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/10 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {ts("chatbot.homeSection.kicker")}
            </div>

            <h2 className="mt-4 text-2xl md:text-4xl font-semibold tracking-tight max-w-3xl">
              {ts("chatbot.homeSection.title")}
            </h2>

            <p className="mt-6 text-muted-foreground max-w-2xl leading-relaxed">
              {ts("chatbot.homeSection.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                type="button"
                size="lg"
                onClick={() => window.dispatchEvent(new CustomEvent("achi:open_chatbot"))}
              >
                {ts("chatbot.homeSection.ctaOpen")}
              </Button>

              <Button asChild variant="outline" size="lg">
                <a href={faqHref}>
                  {ts("chatbot.homeSection.ctaFaq")}
                </a>
              </Button>

              <Button asChild variant="outline" size="lg">
                <a href={servicesHref}>
                  {ts("chatbot.homeSection.ctaServices")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}