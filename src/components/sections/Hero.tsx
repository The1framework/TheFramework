import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const mousePosition = useMousePosition(containerRef);
  const primaryBtnProps = useMagneticButton<HTMLButtonElement>(0.2);
  const secondaryBtnProps = useMagneticButton<HTMLButtonElement>(0.2);
  const { ref: textRef, isVisible: textVisible } = useScrollReveal<HTMLDivElement>(0.1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Staggered word animation for headline
  const headlineWords = ['We', 'Build', 'Digital', 'Experiences', 'That', 'Drive', 'Growth'];
  const highlightWords = ['Digital', 'Experiences'];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-heading">

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating-shape" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating-shape" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />

      </div>

      {/* Mouse-tracked spotlight */}
      <div
        className="absolute inset-0 hero-spotlight pointer-events-none -z-5"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        } as React.CSSProperties}
        aria-hidden="true" />


      {/* Content */}
      <div ref={textRef} className="container mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className={cn(
          'inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-8 badge-pulse transition-all duration-700',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">

          </span>
        </div>

        {/* Main Headline with Staggered Animation */}
        <h1
          id="hero-heading"
          className="text-display-lg md:text-display-xl font-display mb-6 max-w-5xl mx-auto text-balance">

          {headlineWords.map((word, index) =>
          <span
            key={index}
            className={cn(
              'inline-block mr-[0.25em] transition-all duration-500',
              highlightWords.includes(word) ? 'gradient-text underline-draw' : '',
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              textVisible && highlightWords.includes(word) && 'visible'
            )}
            style={{ transitionDelay: `${200 + index * 80}ms` }}>

              {word}
            </span>
          )}
        </h1>

        {/* Subheadline */}
        <p className={cn(
          'text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance transition-all duration-700',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )} style={{ transitionDelay: '600ms' }}>
          Transform your vision into reality with cutting-edge web solutions, 
          AI-powered innovation, and strategic digital marketing.
        </p>

        {/* CTAs */}
        <div className={cn(
          'flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )} style={{ transitionDelay: '700ms' }}>
          <Button
            {...primaryBtnProps}
            variant="hero"
            size="xl"
            className="magnetic-btn micro-bounce group btn-press"
            onClick={() => handleScroll('#contact')}>

            Start Your Project
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button
            {...secondaryBtnProps}
            variant="heroSecondary"
            size="xl"
            className="magnetic-btn group btn-press"
            onClick={() => handleScroll('#about')}>

            <Play className="w-5 h-5" />
            Watch Our Story
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className={cn(
          'mt-16 pt-16 border-t border-border/50 transition-all duration-700',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )} style={{ transitionDelay: '900ms' }}>
          <p className="text-sm text-muted-foreground mb-6">
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {['TechCorp', 'InnovateLab', 'FutureScale', 'DataFlow', 'CloudNex'].map((company, index) => <div
                key={company}
                className={cn(
                  'text-lg font-semibold text-muted-foreground transition-all duration-500 hover:text-primary hover:scale-110',
                  isLoaded ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${1000 + index * 100}ms` }}>

                {company}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>);
}