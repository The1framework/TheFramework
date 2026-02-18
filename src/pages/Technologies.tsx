// src/pages/Technologies.tsx
import type React from "react"
import { useMemo } from "react"
import { ArrowRight, Cpu, Layers, Server, Sparkles, Shield, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { buildPathWithLocale } from "@/utils/langRouting"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
}

function withBase(path: string) {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path.startsWith("mailto:") || path.startsWith("tel:")) return path

  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`

  if (base && p.startsWith(`${base}/`)) return p
  return `${base}${p}`.replace(/\/{2,}/g, "/")
}

function parseLines(value: string) {
  return (value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function TechCard({
  t,
  title,
  icon,
  desc,
  chips,
  logos
}: {
  t: (key: string) => string
  title: string
  icon: React.ReactNode
  desc: string
  chips: string[]
  logos: Array<{ src: string; altKey: string }>
}) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl",
        "border-primary/15 shadow-sm transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40",
        "hover:scale-[1.03] focus-within:scale-[1.03]",
        "hover:bg-primary/10 focus-within:bg-primary/10",
        "focus-within:-translate-y-2 focus-within:shadow-2xl focus-within:border-primary/40"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full blur-3xl",
          "bg-primary/18 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100 group-focus-within:opacity-100"
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100 group-focus-within:opacity-100"
        )}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-2xl border border-primary/30" />
        <div className="absolute -inset-px rounded-2xl border border-primary/15 blur-[1px]" />
      </div>

      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl border",
              "border-primary/15 bg-primary/10 text-primary",
              "transition-all duration-300",
              "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/40",
              "group-focus-within:bg-primary group-focus-within:text-primary-foreground group-focus-within:border-primary/40"
            )}
            aria-hidden="true"
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("technologies.stack.hoverHint") as string}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "mt-5 grid gap-4",
            "opacity-100 translate-y-0 pointer-events-auto",
            "md:opacity-0 md:translate-y-2 md:pointer-events-none",
            "md:transition-all md:duration-300",
            "md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto",
            "md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:pointer-events-auto"
          )}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c, idx) => (
                <span
                  key={`${c}-${idx}`}
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
                    "border-primary/15 bg-primary/5 text-foreground/90",
                    "transition-colors duration-200",
                    "group-hover:border-primary/30 group-hover:bg-primary/10",
                    "group-focus-within:border-primary/30 group-focus-within:bg-primary/10"
                  )}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {logos.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {logos.map((l) => (
                <img
                  key={l.src}
                  src={l.src}
                  alt={t(l.altKey) as string}
                  className={cn(
                    "h-6 w-auto opacity-80 grayscale transition-all duration-300",
                    "group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105",
                    "group-focus-within:opacity-100 group-focus-within:grayscale-0 group-focus-within:scale-105"
                  )}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Technologies({ locale, t }: Props) {
  const servicesHref = buildPathWithLocale(locale, "/services")
  const contactHref = buildPathWithLocale(locale, "/contact")

  const hero = useScrollReveal<HTMLElement>(0.08)
  const why = useScrollReveal<HTMLElement>(0.12)
  const grid = useScrollReveal<HTMLElement>(0.10)
  const choose = useScrollReveal<HTMLElement>(0.10)
  const faq = useScrollReveal<HTMLElement>(0.12)
  const finalCta = useScrollReveal<HTMLElement>(0.12)

  const whyBullets = useMemo(() => parseLines(t("technologies.why.bullets") as string), [t])

  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")
  const tech = (file: string) => `${base}tech/${file}`.replace(/\/{2,}/g, "/")

  const cards = useMemo(
    () => [
      {
        key: "frontend",
        icon: <Layers className="h-5 w-5" />,
        title: t("technologies.stack.frontend.title") as string,
        desc: t("technologies.stack.frontend.desc") as string,
        chips: parseLines(t("technologies.stack.frontend.chips") as string),
        logos: [
          { src: tech("react.svg"), altKey: "technologies.logos.react" },
          { src: tech("nextdotjs.svg"), altKey: "technologies.logos.next" },
          { src: tech("typescript.svg"), altKey: "technologies.logos.typescript" },
          { src: tech("tailwindcss.svg"), altKey: "technologies.logos.tailwind" },
          { src: tech("vite.svg"), altKey: "technologies.logos.vite" }
        ]
      },
      {
        key: "backend",
        icon: <Server className="h-5 w-5" />,
        title: t("technologies.stack.backend.title") as string,
        desc: t("technologies.stack.backend.desc") as string,
        chips: parseLines(t("technologies.stack.backend.chips") as string),
        logos: [{ src: tech("nodedotjs.svg"), altKey: "technologies.logos.node" }]
      },
      {
        key: "ai",
        icon: <Cpu className="h-5 w-5" />,
        title: t("technologies.stack.ai.title") as string,
        desc: t("technologies.stack.ai.desc") as string,
        chips: parseLines(t("technologies.stack.ai.chips") as string),
        logos: []
      },
      {
        key: "seo",
        icon: <Zap className="h-5 w-5" />,
        title: t("technologies.stack.seo.title") as string,
        desc: t("technologies.stack.seo.desc") as string,
        chips: parseLines(t("technologies.stack.seo.chips") as string),
        logos: []
      },
      {
        key: "security",
        icon: <Shield className="h-5 w-5" />,
        title: t("technologies.stack.security.title") as string,
        desc: t("technologies.stack.security.desc") as string,
        chips: parseLines(t("technologies.stack.security.chips") as string),
        logos: []
      },
      {
        key: "devops",
        icon: <Sparkles className="h-5 w-5" />,
        title: t("technologies.stack.devops.title") as string,
        desc: t("technologies.stack.devops.desc") as string,
        chips: parseLines(t("technologies.stack.devops.chips") as string),
        logos: [
          { src: tech("github.svg"), altKey: "technologies.logos.github" },
          { src: tech("githubpages.svg"), altKey: "technologies.logos.githubPages" },
          { src: tech("vercel.svg"), altKey: "technologies.logos.vercel" }
        ]
      }
    ],
    [t, base]
  )

  const homeHref = buildPathWithLocale(locale, "/")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        locale={locale}
        t={t}
        brand={{
          name: "AchiDigital",
          logoSrc: "/AchiDigital.jpeg",
          logoAltKey: "header.brand.logoAlt",
          homeHref
        }}
      />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-[40%] -left-32 h-[420px] w-[420px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-[-180px] right-[-140px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <section
          ref={hero.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-10",
            "opacity-0 translate-y-4 transition-all duration-700",
            hero.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary/90">{t("technologies.hero.kicker") as string}</p>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {t("technologies.hero.h1") as string}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("technologies.hero.sub") as string}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl" className="magnetic-btn group btn-press">
                <a href={servicesHref} aria-label={t("technologies.hero.primaryAria") as string}>
                  {t("technologies.hero.primary") as string}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>

              <Button asChild variant="outline" size="xl" className="magnetic-btn group btn-press">
                <a href={contactHref} aria-label={t("technologies.hero.secondaryAria") as string}>
                  {t("technologies.hero.secondary") as string}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section
          ref={why.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 py-10",
            "opacity-0 translate-y-4 transition-all duration-700",
            why.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="mx-auto grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("technologies.why.h2") as string}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("technologies.why.p") as string}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {whyBullets.map((b, idx) => (
                  <div
                    key={`${b}-${idx}`}
                    className={cn(
                      "rounded-2xl border bg-card/55 backdrop-blur-xl p-4",
                      "border-primary/15 transition-all duration-300",
                      "hover:border-primary/30 hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 rounded-xl bg-primary/10 text-primary grid place-items-center" aria-hidden="true">
                        <Zap className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{b}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">{t("technologies.why.authority") as string}</p>
            </div>
          </div>
        </section>

        <section
          ref={grid.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 py-10",
            "opacity-0 translate-y-4 transition-all duration-700",
            grid.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("technologies.stack.h2") as string}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("technologies.stack.p") as string}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <TechCard key={c.key} t={t} icon={c.icon} title={c.title} desc={c.desc} chips={c.chips} logos={c.logos} />
            ))}
          </div>
        </section>

        <section
          ref={choose.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 py-10",
            "opacity-0 translate-y-4 transition-all duration-700",
            choose.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("technologies.choose.h2") as string}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("technologies.choose.p") as string}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div
                className={cn(
                  "rounded-2xl border bg-card/60 backdrop-blur-xl p-6",
                  "border-primary/15 shadow-sm",
                  "hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                )}
              >
                <p className="text-sm leading-relaxed text-foreground/90">{t("technologies.choose.statement") as string}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {parseLines(t("technologies.choose.points") as string).map((p, idx) => (
                    <div key={`${p}-${idx}`} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-foreground/90">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={faq.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 py-10",
            "opacity-0 translate-y-4 transition-all duration-700",
            faq.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("technologies.faq.h2") as string}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("technologies.faq.p") as string}</p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/15 bg-card/60 backdrop-blur-xl p-2">
            <Accordion type="single" collapsible className="w-full">
              {["1", "2", "3", "4"].map((n) => (
                <AccordionItem key={n} value={`faq-${n}`} className="border-b border-primary/10 last:border-b-0">
                  <AccordionTrigger className="px-4 text-left">{t(`technologies.faq.q${n}`) as string}</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">{t(`technologies.faq.a${n}`) as string}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section
          ref={finalCta.ref}
          className={cn(
            "relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-20",
            "opacity-0 translate-y-4 transition-all duration-700",
            finalCta.isVisible && "opacity-100 translate-y-0"
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur-xl p-8 sm:p-10",
              "border-primary/15 shadow-sm",
              "hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            )}
          >
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/12 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("technologies.cta.h2") as string}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("technologies.cta.p") as string}</p>
              </div>

              <Button asChild variant="hero" size="xl" className="magnetic-btn group btn-press">
                <a href={contactHref} aria-label={t("technologies.cta.aria") as string}>
                  {t("technologies.cta.button") as string}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer
        locale={locale}
        t={t}
        brand={{
          name: "AchiDigital",
          logoSrc: "/AchiDigital.jpeg",
          logoAltKey: "header.brand.logoAlt",
          homeHref
        }}
      />
    </div>
  )
}
