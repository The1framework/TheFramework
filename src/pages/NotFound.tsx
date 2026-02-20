import { useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import type { CSSProperties } from "react"
import { Home, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function normalizeWord(w: string) {
  return w.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "").trim()
}

const NotFound = () => {
  const location = useLocation()

  const highlightWords = useMemo(() => new Set<string>(["not", "found"]), [])

  const h1Lines = useMemo(() => ["Page Not Found"], [])

  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating-shape" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating-shape"
        style={{ animationDelay: "-3s" }}
      />

      <div className="text-center px-6 relative z-10">
        <div className="text-[10rem] font-bold gradient-text leading-none mb-4" aria-hidden="true">
          404
        </div>

        <h1
          id="hero-heading"
          className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance"
        >
          {h1Lines.map((line, lineIndex) => (
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
                    style={{ animationDelay: `${80 + globalIndex * 45}ms` } as CSSProperties}
                  >
                    {word}
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&#39;re looking for doesn&#39;t exist or may have been moved. Use the buttons below to recover
          quickly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button variant="heroSecondary" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Requested path: <span className="font-mono">{location.pathname}</span>
        </div>
      </div>
    </div>
  )
}

export default NotFound
