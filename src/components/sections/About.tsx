// src/components/sections/About.tsx
import { useMemo } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { cn } from "@/lib/utils"
import { Target, Lightbulb, Users, Rocket } from "lucide-react"

type Props = {
  t: (key: string) => string
}

export function About({ t }: Props) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>(0.15)
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.15)

  const values = useMemo(
    () => [
      { icon: Target, titleKey: "aboutSection.values.a.title", descKey: "aboutSection.values.a.description" },
      { icon: Lightbulb, titleKey: "aboutSection.values.b.title", descKey: "aboutSection.values.b.description" },
      { icon: Users, titleKey: "aboutSection.values.c.title", descKey: "aboutSection.values.c.description" },
      { icon: Rocket, titleKey: "aboutSection.values.d.title", descKey: "aboutSection.values.d.description" }
    ],
    []
  )

  const chips = useMemo(
    () => [
      "aboutSection.chips.a",
      "aboutSection.chips.b",
      "aboutSection.chips.c",
      "aboutSection.chips.d"
    ],
    []
  )

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-48 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_55%)]" aria-hidden="true" />

      <div className="container mx-auto px-6">
        <div
          className={cn(
            "text-center mb-14 md:mb-16 transition-all duration-700 motion-reduce:transition-none",
            sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {t("aboutSection.header.kicker")}
          </span> */}

          <h2 id="about-heading" className="text-display-md md:text-display-lg mt-4 mb-6">
            {t("aboutSection.header.titlePrefix")}{" "}
            <span className="gradient-text">{t("aboutSection.header.titleAccent")}</span>
            {t("aboutSection.header.titleSuffix") ? <span> {t("aboutSection.header.titleSuffix")}</span> : null}
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutSection.header.description")}
          </p>
        </div>

        <div
          className={cn(
            "relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.14)] overflow-hidden",
            "transition-all duration-700 motion-reduce:transition-none",
            sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.10),transparent_35%,rgba(56,189,248,0.06))]" aria-hidden="true" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />

          <div className="relative p-7 md:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <h3 className="text-display-sm mb-4">{t("aboutSection.focus.title")}</h3>
                <p className="text-muted-foreground">{t("aboutSection.focus.description")}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {chips.map((key) => (
                    <span
                      key={key}
                      className="inline-flex items-center rounded-full border border-white/10 bg-background/40 backdrop-blur-xl px-3 py-1 text-xs text-foreground/90"
                    >
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div
                  ref={gridRef}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 motion-reduce:transition-none",
                    gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                >
                  {values.map((v, index) => (
                    <div
                      key={v.titleKey}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 card-depth"
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                          <v.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{t(v.titleKey)}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{t(v.descKey)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

        
          </div>
        </div>
      </div>
    </section>
  )
}
