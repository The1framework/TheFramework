// src/pages/NotFound.tsx
import { useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import type { CSSProperties } from "react"
import { Home, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function normalizeWord(w: string) {
  return w.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "").trim()
}

function localePrefix(locale: Props["locale"]) {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

export default function NotFound({ locale, t }: Props) {
  const location = useLocation()

  const highlightWords = useMemo(
    () =>
      new Set(
        (t("notFound.hero.highlightWords") as string)
          .split(" ")
          .map((w) => w.toLowerCase())
      ),
    [t]
  )

  const h1Lines = useMemo(
    () => [(t("notFound.hero.h1") as string)],
    [t]
  )

  const homeTo = useMemo(
    () => `${localePrefix(locale)}/`.replace(/\/{2,}/g, "/"),
    [locale]
  )

  return (
    <div className="bg-background text-foreground flex items-center justify-center relative overflow-hidden py-24">
      <div className="text-center px-6 relative z-10">
        <div className="text-[10rem] font-bold gradient-text leading-none mb-4">
          404
        </div>

        <h1 className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance">
          {h1Lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.split(" ").map((word, index) => {
                const isHighlighted = highlightWords.has(
                  normalizeWord(word)
                )

                return (
                  <span
                    key={`${word}-${index}`}
                    className={cn(
                      "inline-block mr-[0.25em]",
                      isHighlighted ? "gradient-text underline-draw" : ""
                    )}
                  >
                    {word}
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {t("notFound.hero.description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to={homeTo}>
              {t("notFound.cta.home")}
            </Link>
          </Button>

          <Button variant="heroSecondary" size="lg" onClick={() => window.history.back()}>
            {t("notFound.cta.back")}
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          {t("notFound.meta.requestedPath")}{" "}
          <span className="font-mono">{location.pathname}</span>
        </div>
      </div>
    </div>
  )
}