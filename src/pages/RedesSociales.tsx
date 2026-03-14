import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Target, 
  PenTool, 
  CalendarDays, 
  BarChart3, 
  MessageSquareReply, 
  RefreshCcw 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Estrategia personalizada",
    description: "Analizamos tu marca y tu audiencia para definir un plan de acción a medida.",
    icon: Target
  },
  {
    title: "Diseño profesional de contenido",
    description: "Imágenes, reels y stories que destacan en el feed y transmiten tu valor.",
    icon: PenTool
  },
  {
    title: "Calendario editorial",
    description: "Planificamos tus publicaciones con objetivos y fechas claras.",
    icon: CalendarDays
  },
  {
    title: "Monitoreo y reportes mensuales",
    description: "Medimos lo que funciona para seguir creciendo y mejorando tu alcance.",
    icon: BarChart3
  },
  {
    title: "Automatización de respuestas",
    description: "Configuramos respuestas automáticas a comentarios y mensajes para agilizar la atención inicial.",
    icon: MessageSquareReply
  },
  {
    title: "Optimización constante",
    description: "Ajustamos las estrategias y el contenido según resultados y tendencias del mercado.",
    icon: RefreshCcw
  }
];

const faqs = [
  {
    question: "¿Qué incluye exactamente el servicio de gestión de redes?",
    answer: "Incluye estrategia, diseño gráfico, grabación y edición audiovisual, redacción, publicaciones, historias, reels y monitoreo."
  },
  {
    question: "¿En qué redes trabajan?",
    answer: "Nos especializamos en Instagram y Facebook, pero también podemos trabajar TikTok, LinkedIn y YouTube Shorts."
  },
  {
    question: "¿Cuánto tiempo tarda en verse resultados?",
    answer: "Desde el primer mes notarás mejor imagen y organización. A partir del segundo mes se verá mayor alcance, interacción y potenciales clientes."
  },
  {
    question: "¿Debo entregar contenido o ustedes lo crean todo?",
    answer: "Nos adaptamos. Podemos usar contenido que tengas o crearlo desde cero, incluyendo fotografías, videos o grabaciones."
  }
];

const RedesSociales = () => {
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
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                Community Manager Experto
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Impulsa tu presencia digital con una <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 glow-text">
                Gestión Estratégica
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Posicionamos tu marca con estrategia, contenido profesional y automatización. 
              Nos enfocamos en resultados reales: más interacción, más leads y más ventas. 
              Atrae seguidores reales, genera interacción auténtica y convierte visitas en clientes.
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
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
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
                    <span className="text-primary mt-1">Q.</span>
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

export default RedesSociales;
