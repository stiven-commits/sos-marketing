import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Target, 
  Megaphone, 
  TrendingUp, 
  BarChart3, 
  Filter, 
  Users 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Segmentación precisa del público",
    description: "Llegamos a quienes realmente necesitan tu producto o servicio, usando datos e intereses reales.",
    icon: Target
  },
  {
    title: "Anuncios diseñados para convertir",
    description: "Redactamos copys persuasivos, diseñamos piezas atractivas y utilizamos llamados a la acción estratégicos.",
    icon: Megaphone
  },
  {
    title: "Optimización continua",
    description: "Monitoreamos cada campaña, pausamos lo que no funciona y potenciamos lo que da mejores resultados.",
    icon: TrendingUp
  },
  {
    title: "Informes mensuales claros",
    description: "Te mostramos qué funcionó, cuántas personas impactamos, cuántos leads o ventas se generaron.",
    icon: BarChart3
  },
  {
    title: "Embudo de ventas integrado",
    description: "Conectamos tus campañas con landing pages, formularios y automatizaciones si lo necesitas.",
    icon: Filter
  },
  {
    title: "Acompañamiento experto",
    description: "No solo gestionamos tus anuncios: te asesoramos para escalar tus resultados y optimizar tu presupuesto.",
    icon: Users
  }
];

const faqs = [
  {
    question: "¿Cuánto debo invertir en publicidad?",
    answer: "Recomendamos un mínimo de $3 a $5 por día para comenzar, aunque todo depende de tu objetivo y sector."
  },
  {
    question: "¿Ustedes diseñan los anuncios?",
    answer: "Sí, nos encargamos del diseño gráfico, los textos y la estructura estratégica del anuncio."
  },
  {
    question: "¿Puedo elegir el público al que se dirige la campaña?",
    answer: "Sí. Podemos trabajar con audiencias que ya tienes o sugerirte las mejores segmentaciones según tu cliente ideal."
  },
  {
    question: "¿Cuánto tiempo tarda en verse resultados?",
    answer: "Generalmente entre 3 y 7 días, dependiendo del tipo de campaña y de si tienes embudo o página de ventas lista."
  },
  {
    question: "¿Incluye el presupuesto de Meta dentro del servicio?",
    answer: "Sí, junto a nuestro cobro de gestión. Ya que evitamos inconvenientes con Meta que puedan perjudicar el rendimiento del anuncio por retraso de pagos."
  }
];

const MetaAds = () => {
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
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">
                Especialistas en Tráfico Pago
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Atrae, impacta y convierte con <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 glow-text">
                Anuncios Efectivos
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Creamos campañas estratégicas en Facebook e Instagram para ayudarte a conseguir más clientes, 
              generar ventas, captar leads y escalar tu negocio de forma medible. Nos encargamos de todo 
              para que tú te enfoques en atender a tus nuevos clientes.
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
                className="glass-panel p-8 rounded-2xl hover:glow-blue transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-400" />
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
                    <span className="text-blue-400 mt-1">Q.</span>
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

export default MetaAds;
