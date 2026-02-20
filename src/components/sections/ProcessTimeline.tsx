import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { Search, Lightbulb, Code, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Discovery',
    description: 'We dive deep into understanding your business, goals, and target audience to create a tailored strategy.',
  },
  {
    icon: Lightbulb,
    step: '02',
    title: 'Strategy & Design',
    description: 'Our team crafts a comprehensive blueprint and stunning designs that align with your vision.',
  },
  {
    icon: Code,
    step: '03',
    title: 'Development',
    description: 'We build your solution using cutting-edge technologies, ensuring scalability and performance.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Launch & Grow',
    description: 'We launch your project and provide ongoing support to help you achieve continuous growth.',
  },
];

export function ProcessTimeline() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="process-heading"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={cn(
          'text-center mb-16 transition-all duration-700',
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 id="process-heading" className="text-display-md md:text-display-lg mt-4 mb-6">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers results, from initial concept to successful launch.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-accent/50 hidden md:block" aria-hidden="true">
            <div 
              className={cn(
                'absolute top-0 left-0 w-full bg-primary transition-all duration-1000 ease-out timeline-progress',
                sectionVisible ? 'h-full' : 'h-0'
              )}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={cn(
                  'relative md:flex md:items-center transition-all duration-700',
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
                  sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Content Card */}
                <div className={cn(
                  'md:w-[calc(50%-40px)] glass-panel rounded-2xl p-6 card-depth',
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                )}>
                  <div className={cn(
                    'flex items-center gap-4 mb-4',
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  )}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step.step}</span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Timeline Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-4 border-primary items-center justify-center z-10 timeline-node">
                  <span className="text-sm font-bold text-primary">{step.step}</span>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-[calc(50%-40px)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
