// src/App.tsx
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LangRouter, { useLangRouter } from "@/routing/LangRouter"
import ScrollToTop from "@/routing/ScrollToTop"
import { localeRoot } from "@/i18n/runtime"

import { PageLayout } from "@/components/layout/PageLayout"

import Index from "@/pages/Index"
import NotFound from "@/pages/NotFound"
import Services from "@/pages/Services"
import ServiceSlug from "@/pages/ServiceSlug"
import About from "@/pages/About"
import Technologies from "@/pages/Technologies"

const queryClient = new QueryClient()

function RoutedApp() {
  const { locale, t, cleanLocation } = useLangRouter()

  const wrap = (node: React.ReactNode) => (
    <PageLayout locale={locale} t={t}>
      {node}
    </PageLayout>
  )

  return (
    <>
      <ScrollToTop />
      <Routes location={cleanLocation} key={`${cleanLocation.pathname}${cleanLocation.search || ""}`}>
        <Route path="/" element={wrap(<Index locale={locale} t={t} />)} />
        <Route path="/about" element={wrap(<About locale={locale} t={t} />)} />
        <Route path="/services" element={wrap(<Services locale={locale} t={t} />)} />
        <Route path="/services/:serviceSlug" element={wrap(<ServiceSlug locale={locale} t={t} />)} />
        <Route path="/technologies" element={wrap(<Technologies locale={locale} t={t} />)} />

        <Route path="/fr" element={<Navigate to={localeRoot("fr")} replace />} />
        <Route path="/fr/" element={<Navigate to={localeRoot("fr")} replace />} />
        <Route path="/lb" element={<Navigate to={localeRoot("lb")} replace />} />
        <Route path="/lb/" element={<Navigate to={localeRoot("lb")} replace />} />

        <Route path="*" element={wrap(<NotFound locale={locale} t={t} />)} />
      </Routes>
    </>
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