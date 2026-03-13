import { motion } from "framer-motion";
import { Share2, Target, Palette, Monitor, Camera, Video } from "lucide-react";

const services = [
  { icon: Share2, title: "Social Media Management", desc: "Estrategia, contenido y gestión profesional de redes sociales para posicionar tu marca y conectar con tu audiencia." },
  { icon: Target, title: "Meta Ads Advertising", desc: "Campañas publicitarias en Facebook e Instagram diseñadas para atraer clientes potenciales y generar ventas." },
  { icon: Palette, title: "Graphic Design", desc: "Diseños estratégicos que transmiten la identidad de tu marca y generan impacto visual." },
  { icon: Monitor, title: "Web Development", desc: "Creamos páginas web modernas, rápidas y optimizadas para convertir visitantes en clientes." },
  { icon: Camera, title: "Photography", desc: "Fotografía profesional de productos y servicios para redes sociales y campañas." },
  { icon: Video, title: "Video Production", desc: "Producción y edición de videos comerciales que conectan con tu audiencia." },
];

const ServicesOverview = () => {
  return (
    <section id="services" className="py-24 lg:py-32 relative section-glow">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Nuestros <span className="gradient-text">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones digitales diseñadas para atraer clientes, posicionar tu marca y convertir audiencias en clientes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel glass-panel-hover rounded-2xl p-6 lg:p-8 card-lift group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
