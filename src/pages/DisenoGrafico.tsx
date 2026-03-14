import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";
import { 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Printer, 
  Target, 
  FileEdit 
} from "lucide-react";

// Datos extraídos de la web oficial de SOS Marketing
const serviceFeatures = [
  {
    title: "Diseños adaptados a tu identidad",
    description: "Respetamos los colores, tipografías y personalidad de tu marca para lograr coherencia visual.",
    icon: Palette
  },
  {
    title: "Piezas para redes sociales",
    description: "Posts, reels, stories, portadas, banners y todo lo que necesitas para comunicarte con tu audiencia.",
    icon: Layout
  },
  {
    title: "Diseño de marca y branding",
    description: "Creamos logos, paletas de colores, tipografías y manuales de identidad si estás empezando desde cero.",
    icon: ImageIcon
  },
  {
    title: "Diseño para impresos",
    description: "Volantes, afiches, tarjetas, menús, etiquetas, empaques, presentaciones o catálogos físicos.",
    icon: Printer
  },
  {
    title: "Diseño estratégico",
    description: "Creamos piezas que no solo se ven bien, sino que están pensadas para atraer, informar y generar acción.",
    icon: Target
  },
  {
    title: "Entrega en formatos editables",
    description: "Te entregamos los archivos en los formatos que necesites y listos para publicar: JPG, PNG, PDF, Canva o PSD.",
    icon: FileEdit
  }
];

const faqs = [
  {
    question: "¿Qué tipo de diseños ofrecen?",
    answer: "Realizamos diseños digitales (para redes, web, email marketing), impresos (papelería, etiquetas, empaques), branding y materiales corporativos."
  },
  {
    question: "¿Pueden trabajar con mi logo actual o deben crear uno nuevo?",
    answer: "Trabajamos con tu logo actual si ya tienes uno. También podemos rediseñarlo o crearlo desde cero si buscas una renovación visual."
  },
  {
    question: "¿Puedo pedir mis diseños en Canva?",
    answer: "¡Sí! Podemos entregarte plantillas editables en Canva, aunque trabajamos principalmente con programas profesionales como Illustrator o Photoshop."
  },
  {
    question: "¿El diseño incluye textos o solo imágenes?",
    answer: "Incluye todo: imágenes, colores, diagramación y la redacción del mensaje gráfico si lo necesitas para que la pieza comunique correctamente."
  }
];

const DisenoGrafico = () => {
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
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
                Dirección de Arte y Branding
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Comunica tu marca con <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400 glow-text">
                Identidad y Estilo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              El diseño no es solo apariencia: es comunicación visual. Creamos diseños funcionales, 
              estéticos y estratégicos para conectar con tu audiencia y transmitir el valor de 
              tu marca a través de cada elemento gráfico.
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
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 group border border-white/5 hover:border-indigo-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
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
                    <span className="text-indigo-400 mt-1">Q.</span>
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

export default DisenoGrafico;
