import { useLocation } from "react-router-dom";

const services = [
  "Gestion de Redes Sociales",
  "Meta Ads",
  "Diseno Grafico",
  "Desarrollo Web",
  "Fotografia",
  "Produccion de Video",
];

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const sectionHref = (section: string) => (isHome ? `#${section}` : `/#${section}`);

  return (
    <footer className="glass-panel border-t border-border/30 py-16">
      <div className="container mx-auto px-4 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <h3 className="font-heading font-bold text-lg mb-3">
            SOS <span className="gradient-text">Marketing Digital</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Trabajamos con marcas personales y negocios que necesitan crecer digitalmente con una estrategia profesional.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm mb-3 text-foreground">Servicios</h4>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s}>
                <a href={sectionHref("services")} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm mb-3 text-foreground">Contacto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="mailto:atencion@sosmarketing.agency" className="hover:text-foreground transition-colors">atencion@sosmarketing.agency</a>
            </li>
            <li>
              <a href="tel:+584140170980" className="hover:text-foreground transition-colors">+58 414 0170980</a>
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com/marketingsosagency" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Instagram</a>
            <a href="https://www.linkedin.com/company/sos-marketing-digital-agency" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">LinkedIn</a>
            <a href="https://www.facebook.com/marketingsosagency" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Facebook</a>
            <a href="https://www.behance.net/stivenochoa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Behance</a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 mt-10 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
        {new Date().getFullYear()} SOS Marketing Digital. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
