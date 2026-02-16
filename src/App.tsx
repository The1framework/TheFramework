// src/App.tsx
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import LangRouter, { useLangRouter } from "@/routing/LangRouter"
import { localeRoot } from "@/i18n/runtime"

const queryClient = new QueryClient()

function RoutedApp() {
  const { locale, t, cleanLocation } = useLangRouter()

  return (
    <Routes location={cleanLocation} key={`${cleanLocation.pathname}${cleanLocation.search || ""}`}>
      <Route path="/" element={<Index locale={locale} t={t} />} />

      {/* normalize /fr or /lb without trailing slash */}
      <Route path="/fr" element={<Navigate to={localeRoot("fr")} replace />} />
      <Route path="/lb" element={<Navigate to={localeRoot("lb")} replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => {
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

export default App
