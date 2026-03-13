import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/marketingsosagency", icon: <InstagramIcon /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sos-marketing-digital-agency", icon: <LinkedInIcon /> },
  { label: "Facebook", href: "https://www.facebook.com/marketingsosagency", icon: <FacebookIcon /> },
  { label: "Behance", href: "https://www.behance.net/stivenochoa", icon: <BehanceIcon /> },
];

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function BehanceIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 6.053-2.207 7.061zM2.928 8.986v3.888h3.906c2.615 0 2.834-3.888 0-3.888H2.928zm3.776 6.548H2.928v4.09h3.824c3.019-.029 3.091-4.09-.048-4.09z" />
    </svg>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/30"
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-18">
        <a href="#home" className="font-heading font-bold text-lg tracking-tight text-foreground">
          SOS <span className="gradient-text">Marketing Digital</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm btn-glow"
          >
            Get a Proposal
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-panel border-t border-border/30 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    {s.icon}
                  </a>
                ))}
              </div>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm text-center btn-glow">
                Get a Proposal
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
