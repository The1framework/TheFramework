import { useMemo, useState } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Shield, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/i18n/useI18n"

type ContactInfoItem = {
  key: "email" | "phone" | "location"
  icon: typeof Mail
  labelKey: string
  valueKey: string
  href: string
}

export function Contact() {
  const { t } = useI18n()
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    businessEmail: "",
    company: "",
    serviceInterest: "",
    message: "",
    website: "", // honeypot (should stay empty)
  })

  const contactInfo: ContactInfoItem[] = useMemo(
    () => [
      {
        key: "email",
        icon: Mail,
        labelKey: "contact.business.emailLabel",
        valueKey: "contact.business.emailValue",
        href: `mailto:${t("contact.business.emailValue") as string}`,
      },
      {
        key: "phone",
        icon: Phone,
        labelKey: "contact.business.phoneLabel",
        valueKey: "contact.business.phoneValue",
        href: `tel:${(t("contact.business.phoneTel") as string) || ""}`,
      },
      {
        key: "location",
        icon: MapPin,
        labelKey: "contact.business.locationLabel",
        valueKey: "contact.business.locationValue",
        href: t("contact.business.locationHref") as string,
      },
    ],
    [t]
  )

  const serviceOptions = useMemo(
    () => [
      { value: "web", label: t("contact.form.service.options.web") as string },
      { value: "seo", label: t("contact.form.service.options.seo") as string },
      { value: "design", label: t("contact.form.service.options.design") as string },
      { value: "ecommerce", label: t("contact.form.service.options.ecommerce") as string },
      { value: "other", label: t("contact.form.service.options.other") as string },
    ],
    [t]
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot: if filled, silently "succeed"
    if (formData.website.trim().length > 0) {
      return
    }

    setIsSubmitting(true)

    // TODO: replace this with real submit (API/email service).
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: t("contact.toast.title") as string,
      description: t("contact.toast.description") as string,
    })

    setFormData({
      fullName: "",
      businessEmail: "",
      company: "",
      serviceInterest: "",
      message: "",
      website: "",
    })
    setIsSubmitting(false)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* separators + decorative (OK: no hidden SEO text) */}
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div
        className="absolute -left-40 top-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-40 bottom-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6">
        {/* 1) Heading + 2) Short intro */}
        <div
          className={cn(
            "text-center mb-14 transition-all duration-700",
            sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* If this is inside home page -> H2 (SEO rule). If you later use it as /contact page, switch to H1 there. */}
          <h2 id="contact-heading" className="text-display-md md:text-display-lg">
            {t("contact.heading") as string}
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-5">
            {t("contact.intro") as string}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* 5) Contact Form */}
          <div
            className={cn(
              "lg:col-span-3 glass-panel rounded-3xl p-8 md:p-10 transition-all duration-700 delay-200",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-describedby="contact-privacy-text"
            >
              {/* Honeypot field (hidden visually but not “SEO content”, just anti-spam input) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">{t("contact.form.honeypotLabel") as string}</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    {t("contact.form.fullName.label") as string}
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder={t("contact.form.fullName.placeholder") as string}
                    className="bg-background/50 border-border/50 focus:border-primary focus-glow"
                  />
                </div>

                <div>
                  <label htmlFor="businessEmail" className="block text-sm font-medium mb-2">
                    {t("contact.form.businessEmail.label") as string}
                  </label>
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    required
                    value={formData.businessEmail}
                    onChange={handleChange}
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t("contact.form.businessEmail.placeholder") as string}
                    className="bg-background/50 border-border/50 focus:border-primary focus-glow"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {t("contact.form.company.label") as string}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    autoComplete="organization"
                    placeholder={t("contact.form.company.placeholder") as string}
                    className="bg-background/50 border-border/50 focus:border-primary focus-glow"
                  />
                </div>

                <div>
                  <label htmlFor="serviceInterest" className="block text-sm font-medium mb-2">
                    {t("contact.form.service.label") as string}
                  </label>
                  <select
                    id="serviceInterest"
                    name="serviceInterest"
                    required
                    value={formData.serviceInterest}
                    onChange={handleChange}
                    className={cn(
                      "w-full h-10 rounded-md border bg-background/50 px-3 text-sm",
                      "border-border/50 focus:outline-none focus:border-primary focus-glow"
                    )}
                    aria-describedby="service-help"
                  >
                    <option value="">{t("contact.form.service.placeholder") as string}</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p id="service-help" className="mt-2 text-xs text-muted-foreground">
                    {t("contact.form.service.help") as string}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t("contact.form.message.label") as string}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.form.message.placeholder") as string}
                  rows={6}
                  className="bg-background/50 border-border/50 focus:border-primary resize-none focus-glow"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full btn-press"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  (t("contact.form.submitSubmitting") as string)
                ) : (
                  <>
                    {t("contact.form.submit") as string}
                    <Send className="w-4 h-4 ml-2" aria-hidden="true" />
                  </>
                )}
              </Button>

              {/* 6) Privacy reassurance (visible, near form) */}
              <div id="contact-privacy-text" className="space-y-3 pt-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>{t("contact.privacy.text") as string}</span>
                </div>
              </div>
            </form>
          </div>

          {/* 3) Business info + 4) Contact methods + 7) What happens next + 8) Alternative */}
          <div
            className={cn(
              "lg:col-span-2 space-y-6 transition-all duration-700 delay-300",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Business information (entity signal) */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-semibold mb-3">{t("contact.business.title") as string}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">{t("contact.business.name") as string}</p>
                <p>{t("entity.definition") as string}</p>
                <p>{t("contact.business.areaServed") as string}</p>
              </div>
            </div>

            {/* Contact methods (plain text + links) */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="glass-panel rounded-2xl p-6 flex items-center gap-4 card-depth block"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t(item.labelKey) as string}</p>
                    <p className="font-semibold">{t(item.valueKey) as string}</p>
                  </div>
                </a>
              ))}

              <a
                href={t("contact.methods.whatsappHref") as string}
                className="glass-panel rounded-2xl p-6 flex items-center gap-4 card-depth block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-6 h-6 text-primary"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.2 4.8 1.8 7.7 1.8 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-6.9-2l-.5-.3-4.6 1.2 1.2-4.5-.3-.5c-1.3-2-2-4.4-2-6.9C3 8.7 8.7 3 16 3s13 5.7 13 13-5.7 12.8-13 12.8zm7.3-9.6c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7-.1-.2-.9-2.2-1.2-3-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .4-.3.3-1.3 1.2-1.3 3 0 1.8 1.3 3.5 1.5 3.7.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.2.8.9.3 1.8.2 2.5.1.8-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.methods.whatsappLabel") as string}
                  </p>
                  <p className="font-semibold">{t("contact.methods.whatsappValue") as string}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* JSON-LD for Organization + ContactPoint (visible text already exists above; schema just supports it) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: t("contact.schema.orgName") as string,
              url: t("contact.schema.url") as string,
              description: t("entity.definition") as string,
              email: t("contact.business.emailValue") as string,
              telephone: t("contact.business.phoneValue") as string,
              areaServed: t("contact.schema.areaServed") as string,
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: t("contact.schema.contactType") as string,
                  email: t("contact.business.emailValue") as string,
                  telephone: t("contact.business.phoneValue") as string,
                  areaServed: t("contact.schema.areaServed") as string,
                  availableLanguage: t("contact.schema.availableLanguage") as string,
                },
              ],
            }),
          }}
        />
      </div>
    </section>
  )
}
