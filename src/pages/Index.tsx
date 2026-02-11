import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';

import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function Index() {
  // Set light mode by default (remove dark class if present)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <ProcessTimeline />
        
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
