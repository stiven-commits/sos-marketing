import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Laptop, 
  ShoppingCart, 
  Settings, 
  Search, 
  ShieldCheck, 
  Code2 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Diseño web responsive y atractivo",
    description: "Tu web se verá bien en computadoras, tablets y teléfonos, con un diseño moderno y profesional.",
    icon: Laptop
  },
  {
    title: "Webs autoadministrables",
    description: "Te enseñamos a gestionar tus contenidos en WordPress o Wix de forma fácil y sin depender de nadie.",
    icon: Settings
  },
  {
    title: "Tienda online (eCommerce)",
    description: "Creamos tu tienda en WooCommerce u otras plataformas, con pasarelas de pago y catálogo integrado.",
    icon: ShoppingCart
  },
  {
    title: "Optimización SEO básica",
    description: "Indexamos tu web en Google, optimizamos títulos, velocidad y configuramos tu analítica básica.",
    icon: Search
  },
  {
    title: "Alojamiento, dominio y SSL",
    description: "Te entregamos todo listo y funcionando: nombre de dominio, servidor y certificado de seguridad.",
    icon: ShieldCheck
  },
  {
    title: "Desarrollo a medida",
    description: "Si necesitas algo más potente, también trabajamos con código limpio (HTML, CSS, JS y PHP).",
    icon: Code2
  }
];

const faqs = [
  {
    question: "¿Qué plataformas utilizan para desarrollar las páginas web?",
    answer: "Trabajamos con WordPress, Wix, WooCommerce y también desarrollamos webs desde cero en código puro según la necesidad del proyecto."
  },
  {
    question: "¿Incluye dominio y hosting?",
    answer: "Sí. Nuestros paquetes incluyen dominio .com o .net, servidor compartido o privado según el plan, y certificado SSL."
  },
  {
    question: "¿Qué tipo de páginas pueden desarrollar?",
    answer: "Páginas corporativas, tiendas online, blogs, portafolios, páginas de servicios, landings para campañas y más."
  },
  {
    question: "¿Cuánto tiempo toma desarrollar la web?",
    answer: "Depende del tipo de proyecto, pero en promedio toma entre 7 y 20 días hábiles desde la recepción y aprobación del contenido."
  },
  {
    question: "¿Puedo autogestionar mi web luego?",
    answer: "Sí. En proyectos con WordPress o Wix te enseñamos cómo hacerlo y te dejamos todo listo para que seas independiente con tus actualizaciones."
  }
];

const DesarrolloWeb = () => {
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
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                Desarrollo y Diseño Web
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Tu negocio en internet con <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 glow-text">
                Diseño y Estrategia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Tener una web profesional ya no es opcional. Creamos páginas web optimizadas, 
              atractivas y funcionales que no solo se ven bien, sino que están pensadas 
              para posicionarse en Google, vender y convertir visitantes en clientes.
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
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group border border-white/5 hover:border-emerald-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
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
                    <span className="text-emerald-400 mt-1">Q.</span>
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

export default DesarrolloWeb;
