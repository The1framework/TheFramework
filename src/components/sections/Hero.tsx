import { useMemo, useRef } from "react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { useMagneticButton } from "@/hooks/useMagneticButton"
import { useMousePosition } from "@/hooks/useMousePosition"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/useI18n"

function normalizeWord(w: string) {
  return w
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim()
}

export function Hero() {
  const { t } = useI18n()

  const containerRef = useRef<HTMLElement>(null)
  const mousePosition = useMousePosition(containerRef)

  const primaryBtnProps = useMagneticButton<HTMLAnchorElement>(0.2)
  const secondaryBtnProps = useMagneticButton<HTMLAnchorElement>(0.2)

  const headline = (t("home.hero.h1") as string) || ""
  const subheading = (t("home.hero.subheading") as string) || ""
  const complianceNote = (t("home.hero.complianceNote") as string) || ""

  const headlineWords = useMemo(() => headline.split(/\s+/).filter(Boolean), [headline])

  const highlightWords = useMemo(() => {
    const list = t("home.hero.h1Highlights") as unknown
    const arr = Array.isArray(list) ? (list as string[]) : []
    return new Set(arr.map(normalizeWord).filter(Boolean))
  }, [t])

  const trustItems = useMemo(() => {
    const list = t("home.hero.trustItems") as unknown
    return Array.isArray(list) ? (list as string[]) : []
  }, [t])

const primaryHref = "/#contact"
  const secondaryHref = (t("home.hero.secondaryCtaHref") as string) || "/services"

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating-shape" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating-shape"
          style={{ animationDelay: "-3s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div
        className="absolute inset-0 hero-spotlight pointer-events-none -z-5"
        style={
          {
            "--mouse-x": `${mousePosition.x}%`,
            "--mouse-y": `${mousePosition.y}%`,
          } as CSSProperties
        }
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 py-20 text-center">
       <h1
  id="hero-heading"
  className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance"
>
  {[
    "Web Development &",
    "SEO Solutions for",
    "Business Growth",
  ].map((line, lineIndex) => (
    <span key={lineIndex} className="block">
      {line.split(" ").map((word, index) => {
        const globalIndex = lineIndex * 10 + index
        const isHighlighted = highlightWords.has(normalizeWord(word))

        return (
          <span
            key={`${word}-${index}`}
            className={cn(
              "inline-block mr-[0.25em]",
              isHighlighted ? "gradient-text underline-draw" : "",
              "motion-safe:animate-heroWordUpTranslate motion-reduce:animate-none"
            )}
            style={{
              animationDelay: `${80 + globalIndex * 45}ms`,
            } as CSSProperties}
          >
            {word}
          </span>
        )
      })}
    </span>
  ))}
      </h1>


        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance motion-safe:animate-heroFadeUpTranslate motion-reduce:animate-none">
          {subheading}
        </p>

        {/* Trust line (single line, not chips) */}
        {trustItems.length > 0 ? (
          <p className="mb-10 text-xs md:text-sm text-muted-foreground/80">
            {trustItems.map((item, idx) => (
              <span key={`${item}-${idx}`}>
                {item}
                {idx < trustItems.length - 1 ? " • " : ""}
              </span>
            ))}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 motion-safe:animate-heroFadeUpTranslate motion-reduce:animate-none">
          <Button asChild variant="hero" size="xl" className="magnetic-btn micro-bounce group btn-press">
            <a {...primaryBtnProps} href={primaryHref} aria-label={t("home.hero.primaryCtaAria") as string}>
              {t("home.hero.primaryCtaLabel") as string}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </Button>

          <Button asChild variant="heroSecondary" size="xl" className="magnetic-btn group btn-press">
            <a {...secondaryBtnProps} href={secondaryHref} aria-label={t("home.hero.secondaryCtaAria") as string}>
              {t("home.hero.secondaryCtaLabel") as string}
            </a>
          </Button>
        </div>

      
      </div>
    </section>
  )
}
