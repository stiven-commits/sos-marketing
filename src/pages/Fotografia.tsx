import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Camera, 
  Image as ImageIcon, 
  Users, 
  MonitorSmartphone, 
  Wand2, 
  Building 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Fotografía de producto (e-commerce)",
    description: "Imágenes nítidas, con fondo blanco o creativo, ideales para tiendas online y catálogos.",
    icon: ImageIcon
  },
  {
    title: "Sesiones en contexto (lifestyle)",
    description: "Mostramos tus productos o servicios en uso real, para conectar emocionalmente con tu cliente ideal.",
    icon: Camera
  },
  {
    title: "Retratos corporativos",
    description: "Fotografía profesional para el equipo humano detrás de tu empresa. Ideal para LinkedIn, web y branding.",
    icon: Users
  },
  {
    title: "Optimización para redes sociales",
    description: "Entregamos los formatos adaptados para Instagram, Facebook, anuncios, stories y reels.",
    icon: MonitorSmartphone
  },
  {
    title: "Edición profesional incluida",
    description: "Retoque digital, corrección de color y recortes personalizados. Entregamos fotos listas para usar.",
    icon: Wand2
  },
  {
    title: "Sesiones a domicilio o estudio",
    description: "Nos adaptamos a tu negocio. Podemos realizar las tomas donde te resulte más cómodo y funcional.",
    icon: Building
  }
];

const faqs = [
  {
    question: "¿Qué tipo de productos o servicios fotografían?",
    answer: "Todo tipo de productos físicos, servicios en local, atención al cliente, comida, moda, salud, estética, educación y más."
  },
  {
    question: "¿Cuántas fotos entregan por sesión?",
    answer: "Depende del paquete, pero entregamos entre 15 y 30 fotos editadas, en alta calidad y optimizadas para redes."
  },
  {
    question: "¿Incluye edición profesional?",
    answer: "Sí. Todas las fotos se entregan editadas, con color corregido y listas para usar."
  },
  {
    question: "¿Hacen fotos en locaciones externas o solo en estudio?",
    answer: "Ambas. Nos adaptamos a la necesidad del cliente y del concepto de la marca."
  },
  {
    question: "¿Cuál es el tiempo de entrega?",
    answer: "Entre 3 y 8 días hábiles según la cantidad de fotos y la complejidad del retoque."
  }
];

const Fotografia = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        {/* Cabecera / Hero del Servicio */}
        <section className="container mx-auto px-4 md:px-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="inline-block glass-panel px-4 py-1.5 rounded-full mb-4">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                Dirección de Arte y Fotografía
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Captura lo que vende con <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 glow-text">
                Fotografía Profesional
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Conecta visualmente con tu cliente ideal. Creamos imágenes impactantes y personalizadas 
              que muestran el valor real de tu marca, elevando la percepción, el deseo de compra y la confianza.
            </p>
          </motion.div>
        </section>

        {/* Características / Beneficios en Grid */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 group border border-white/5 hover:border-amber-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sección de Preguntas Frecuentes */}
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass-panel p-8 md:p-12 rounded-3xl"
          >
            <h2 className="text-3xl font-heading font-bold text-center mb-10">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  <h4 className="text-lg font-bold mb-2 text-foreground flex items-start gap-3">
                    <span className="text-amber-400 mt-1">Q.</span>
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Fotografia;
