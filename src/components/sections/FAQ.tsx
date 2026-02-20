// src/components/sections/FAQ.tsx
import { useMemo } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function parsePairs(value: string) {
  const raw = (value || "").trim()
  if (!raw) return []
  return raw
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [qLine, ...rest] = block.split("\n")
      const question = (qLine || "").replace(/^Q:\s*/i, "").trim()
      const answer = rest.join("\n").replace(/^A:\s*/i, "").trim()
      return { question, answer }
    })
    .filter((x) => x.question && x.answer)
}

export function FAQ({ locale, t }: Props) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>(0.12)

  const faqs = useMemo(() => {
    return parsePairs(t("faq.items") as string)
  }, [t])

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="faq-heading"
    >
      <div className="absolute top-0 left-0 w-full h-px section-separator" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              "text-center mb-12 transition-all duration-700",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2 id="faq-heading" className="text-display-md md:text-display-lg mt-4 mb-6">
              {t("faq.title.prefix") as string}{" "}
              <span className="gradient-text">{t("faq.title.highlight") as string}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t("faq.subtitle") as string}</p>
          </div>

          <div
            className={cn(
              "transition-all duration-700 delay-200",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-panel rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div
            className={cn(
              "text-center mt-12 transition-all duration-700 delay-300",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
         
          </div>
        </div>
      </div>
    </section>
  )
}
