import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import AIFlowDiagram from "@/components/AIFlowDiagram";
import { motion } from "framer-motion";
import { 
  Cpu, 
  MessageSquareCode, 
  Zap, 
  Database, 
  Bot, 
  Code 
} from "lucide-react";

const serviceFeatures = [
  {
    title: "Chatbots con IA Real",
    description: "Implementamos agentes inteligentes en WhatsApp, Instagram y Facebook que entienden y resuelven, no solo siguen menús.",
    icon: Bot
  },
  {
    title: "Flujos con n8n",
    description: "Conectamos todas tus herramientas (CRM, Sheets, Mail) mediante flujos de automatización potentes y escalables.",
    icon: Zap
  },
  {
    title: "Integración con OpenAI",
    description: "Utilizamos la tecnología de GPT-4o para que tu negocio procese información, redacte y analice de forma autónoma.",
    icon: MessageSquareCode
  },
  {
    title: "Sistemas Online Dedicados",
    description: "Desarrollamos plataformas a medida bajo tus requisitos exactos, centralizando tu operación en la nube.",
    icon: Database
  },
  {
    title: "IA en tus Aplicaciones",
    description: "Si ya tienes un sistema, le inyectamos 'cerebro' mediante IA para tareas de clasificación, resumen o predicción.",
    icon: Cpu
  },
  {
    title: "Desarrollo bajo demanda",
    description: "Soluciones de software personalizadas que resuelven problemas específicos de tu flujo de trabajo diario.",
    icon: Code
  }
];

const faqs = [
  {
    question: "¿En qué redes sociales pueden instalar la IA?",
    answer: "Podemos integrarla principalmente en WhatsApp, Instagram y Facebook Messenger, conectándola directamente con tu base de conocimientos."
  },
  {
    question: "¿Qué es n8n y por qué lo usan?",
    answer: "n8n es una herramienta líder de automatización que nos permite conectar más de 400 aplicaciones, asegurando que los datos fluyan entre tus chats y tu sistema de gestión."
  },
  {
    question: "¿Mi empresa necesita un sistema muy grande para usar IA?",
    answer: "Para nada. Desde pequeñas marcas personales hasta empresas con sistemas complejos pueden beneficiarse de automatizar tareas repetitivas."
  },
  {
    question: "¿Los sistemas dedicados son propiedad del cliente?",
    answer: "Totalmente. Desarrollamos la solución bajo tus requisitos y te entregamos una herramienta funcional y privada para tu negocio."
  }
];

const IAAutomation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <section className="container mx-auto px-4 md:px-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="inline-block glass-panel px-4 py-1.5 rounded-full mb-4">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
                Next-Gen Automation
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Inteligencia Artificial y <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 glow-text">
                Sistemas Dedicados
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Lleva tu negocio al siguiente nivel con agentes de IA en tus chats y sistemas online 
              diseñados a medida. Automatizamos tus flujos de trabajo con n8n y OpenAI para 
              que tu marca nunca deje de atender y vender.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 md:px-6 mb-24">
          <AIFlowDiagram />
        </section>

        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 group border border-white/5 hover:border-cyan-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

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
                    <span className="text-cyan-400 mt-1">Q.</span>
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

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default IAAutomation;
