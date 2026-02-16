import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Web Development', href: '#services' },
    { label: 'UI/UX Design', href: '#services' },
    { label: 'Digital Marketing', href: '#services' },
    { label: 'Mobile Apps', href: '#services' },
    { label: 'AI Solutions', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Team', href: '#about' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#blogs' },
    { label: 'Contact', href: '#contact' },
  ],
  resources: [
    { label: 'Case Studies', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Partners', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden" role="contentinfo">
      <div className="absolute top-0 left-0 w-full h-px section-separator" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

        
        {/* Brand Column */}
<div>
  <a href="/" className="flex items-center gap-3 mb-6">
    {/* Logo Image (same as header) */}
    <img
      src="/AchiDigital.jpeg"
      alt="Achi Digital Logo"
      className="w-10 h-10 object-contain"
    />

    <span className="font-display font-bold text-xl">
      Achi<span className="gradient-text">Digital</span>
    </span>
  </a>

  <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
    Performance-driven digital services built for growth,
    visibility, and long-term scalability.
  </p>
</div>


          {/* Company Column */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AchiDigital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

