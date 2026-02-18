// src/components/layout/Footer.tsx
import { cn } from "@/lib/utils"

type Props = {
  locale: "en" | "fr" | "lb"
  t: (key: string) => string
  brand?: {
    name: string
    logoSrc?: string
    logoAltKey: string
    homeHref?: string
  }
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

function localePrefix(locale: Props["locale"]) {
  if (locale === "fr") return "/fr"
  if (locale === "lb") return "/lb"
  return ""
}

function hrefFor(locale: Props["locale"], cleanPath: string) {
  const pref = localePrefix(locale)
  const p = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`
  return withBase(`${pref}${p}` || "/")
}

export function Footer({ locale, t, brand }: Props) {
  const currentYear = new Date().getFullYear()

  const brandName = brand?.name || (t("footer.brand.name") as string)
  const logoSrc = brand?.logoSrc || (t("footer.brand.logoSrc") as string)
  const logoAlt = t(brand?.logoAltKey || "footer.brand.logoAlt") as string
  const homeHref = brand?.homeHref ? withBase(brand.homeHref) : hrefFor(locale, "/")

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden" role="contentinfo">
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <a href={homeHref} className="flex items-center gap-3 mb-6">
             <img src={withBase(logoSrc)} alt={logoAlt} className="w-10 h-10 object-contain" />
              <span className="font-display font-bold text-xl">
                {t("footer.brand.wordA") as string}
                <span className="gradient-text">{t("footer.brand.wordB") as string}</span>
              </span>
            </a>

            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {t("footer.brand.description")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.columns.company.title")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={hrefFor(locale, "/")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.columns.company.links.home")}
                </a>
              </li>
              <li>
                <a
                  href={hrefFor(locale, "/about")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.columns.company.links.about")}
                </a>
              </li>
              <li>
                <a
                  href={hrefFor(locale, "/services")}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    "opacity-80"
                  )}
                >
                  {t("footer.columns.company.links.services")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.columns.legal.title")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={hrefFor(locale, "/privacy-policy")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.columns.legal.links.privacy")}
                </a>
              </li>
              <li>
                <a
                  href={hrefFor(locale, "/terms-of-service")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.columns.legal.links.terms")}
                </a>
              </li>
              <li>
                <a
                  href={hrefFor(locale, "/cookie-policy")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.columns.legal.links.cookies")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.bottom.prefix")} {currentYear} {brandName}. {t("footer.bottom.suffix")}
          </p>
        </div>
      </div>
    </footer>
  )
}
