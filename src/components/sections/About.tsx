import { useScrollReveal } from "@/hooks/useScrollReveal"
import { cn } from "@/lib/utils"
import { Target, Lightbulb, Users, Rocket } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We focus on measurable outcomes that align with your business goals."
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We use modern web standards and smart systems to keep you ahead."
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "We build long-term partnerships through clarity, delivery, and reliability."
  },
  {
    icon: Rocket,
    title: "Growth Focused",
    description: "Every build is designed to scale — performance, SEO, and maintainability."
  }
]

export function About() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>(0.15)
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.15)

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-48 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_55%)]" aria-hidden="true" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-14 md:mb-16 transition-all duration-700 motion-reduce:transition-none",
            sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">About</span>
          <h2 id="about-heading" className="text-display-md md:text-display-lg mt-4 mb-6">
            Built for <span className="gradient-text">Performance</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minimal, SEO-safe, and performance-first websites with premium design details that stay lightweight.
          </p>
        </div>

        {/* Main wrapper */}
        <div
          className={cn(
            "relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.14)] overflow-hidden",
            "transition-all duration-700 motion-reduce:transition-none",
            sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* Accent layers */}
          <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.10),transparent_35%,rgba(56,189,248,0.06))]" aria-hidden="true" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />

          <div className="relative p-7 md:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left */}
              <div className="lg:col-span-5">
                <h3 className="text-display-sm mb-4">Our Focus</h3>
                <p className="text-muted-foreground">
                  Strategy before visuals, performance before effects, and clarity before complexity so your site stays fast,
                  indexable, and scalable.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["SEO-safe structure", "Core Web Vitals", "Clean semantics", "Long-term maintainability"].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-white/10 bg-background/40 backdrop-blur-xl px-3 py-1 text-xs text-foreground/90"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-7">
                <div
                  ref={gridRef}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 motion-reduce:transition-none",
                    gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                >
                  {values.map((value, index) => (
                    <div
                      key={value.title}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 card-depth"
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                          <value.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{value.title}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTERED LINE */}
            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Designed to feel premium. Built to stay lightweight, stable, and easy to evolve.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
