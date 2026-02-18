// src/App.tsx
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LangRouter, { useLangRouter } from "@/routing/LangRouter"
import { localeRoot } from "@/i18n/runtime"

import Index from "@/pages/Index"
import NotFound from "@/pages/NotFound"
import Services from "@/pages/Services"
import ServiceSlug from "@/pages/ServiceSlug"
import About from "@/pages/About"
import Technologies from "@/pages/Technologies"

const queryClient = new QueryClient()

function RoutedApp() {
  const { locale, t, cleanLocation } = useLangRouter()

  return (
    <Routes location={cleanLocation} key={`${cleanLocation.pathname}${cleanLocation.search || ""}`}>
      {/* Home */}
      <Route path="/" element={<Index locale={locale} t={t} />} />

      {/* About (entity + E-E-A-T) */}
      <Route path="/about" element={<About locale={locale} t={t} />} />

      {/* Services listing (SEO core list, no details) */}
      <Route path="/services" element={<Services locale={locale} t={t} />} />

      {/* Dynamic single service pages by slug */}
      <Route path="/services/:serviceSlug" element={<ServiceSlug locale={locale} t={t} />} />

      {/* Technologies */}
      <Route path="/technologies" element={<Technologies locale={locale} t={t} />} />

      {/* Normalize /fr or /lb visits to locale root */}
      <Route path="/fr" element={<Navigate to={localeRoot("fr")} replace />} />
      <Route path="/fr/" element={<Navigate to={localeRoot("fr")} replace />} />
      <Route path="/lb" element={<Navigate to={localeRoot("lb")} replace />} />
      <Route path="/lb/" element={<Navigate to={localeRoot("lb")} replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <LangRouter>
            <RoutedApp />
          </LangRouter>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
