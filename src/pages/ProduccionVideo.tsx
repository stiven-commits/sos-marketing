import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Video, 
  Clapperboard, 
  Mic, 
  Scissors, 
  Smartphone, 
  MapPin 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Videos promocionales",
    description: "Creamos piezas visuales que muestran el valor de lo que ofreces de forma clara, atractiva y profesional.",
    icon: Video
  },
  {
    title: "Videos en contexto (lifestyle)",
    description: "Grabamos en locaciones reales para que tu cliente ideal se identifique con la experiencia que ofreces.",
    icon: Clapperboard
  },
  {
    title: "Testimoniales y entrevistas",
    description: "Conecta desde lo emocional con historias reales de clientes o voceros de tu marca.",
    icon: Mic
  },
  {
    title: "Edición profesional incluida",
    description: "Montaje, color, sonido, música libre de derechos, subtítulos, efectos. Todo para que el video esté listo.",
    icon: Scissors
  },
  {
    title: "Optimización para redes",
    description: "Entregamos versiones adaptadas para reels, historias, YouTube o publicidad (horizontal y vertical).",
    icon: Smartphone
  },
  {
    title: "Grabación en locación o estudio",
    description: "Vamos donde tu marca necesite. Nos adaptamos a tu locación ideal o producimos en nuestro estudio.",
    icon: MapPin
  }
];

const faqs = [
  {
    question: "¿Qué tipo de videos realizan?",
    answer: "Realizamos videos publicitarios, institucionales, testimoniales, para redes sociales, lanzamientos de productos y cobertura de eventos."
  },
  {
    question: "¿Qué duración tienen los videos entregados?",
    answer: "Depende del paquete, entregamos videos entre 30 segundos y 3 minutos o más, según el objetivo y plataforma."
  },
  {
    question: "¿Filman en exteriores o solo en estudio?",
    answer: "Ambos. Grabamos en locaciones internas, externas o en tu negocio según lo requiera el proyecto."
  },
  {
    question: "¿Cuál es el tiempo de entrega del video?",
    answer: "Entre 5 y 10 días hábiles según la duración y complejidad del video."
  },
  {
    question: "¿Incluye edición de video profesional?",
    answer: "Sí. Todos los videos se entregan editados, con música, efectos, subtítulos si lo requiere, y optimizados para redes."
  }
];

const ProduccionVideo = () => {
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
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500">
                Producción Audiovisual
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Impacta a tu audiencia con <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-400 glow-text">
                Videos Comerciales
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Cautiva a tu audiencia con videos que cuentan la historia de tu marca. 
              Creamos contenido audiovisual estratégico para redes sociales, anuncios, 
              campañas y presentaciones. Genera impacto visual y convierte audiencias en clientes.
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
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] transition-all duration-300 group border border-white/5 hover:border-fuchsia-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-fuchsia-400" />
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
                    <span className="text-fuchsia-400 mt-1">Q.</span>
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

export default ProduccionVideo;
