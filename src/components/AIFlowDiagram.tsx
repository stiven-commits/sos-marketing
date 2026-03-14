import { motion } from "framer-motion";
import { MessageSquare, Cpu, Zap, Database, CheckCircle2 } from "lucide-react";

const AIFlowDiagram = () => {
  const nodes = [
    { id: 1, label: "Usuario (RRSS)", icon: MessageSquare, color: "bg-blue-500", borderColor: "border-blue-500/50" },
    { id: 2, label: "n8n (Cerebro)", icon: Zap, color: "bg-orange-500", borderColor: "border-orange-500/50" },
    { id: 3, label: "OpenAI (IA)", icon: Cpu, color: "bg-emerald-500", borderColor: "border-emerald-500/50" },
    { id: 4, label: "Tu Sistema / CRM", icon: Database, color: "bg-indigo-500", borderColor: "border-indigo-500/50" },
  ];

  return (
    <div className="py-12 px-4 glass-panel rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      <h3 className="text-2xl font-heading font-bold text-center mb-12">
        ¿Cómo funciona tu <span className="text-cyan-400">Ecosistema Inteligente</span>?
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-around gap-8 relative group">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center z-10 w-full md:w-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`w-20 h-20 rounded-2xl ${node.color} bg-opacity-20 border ${node.borderColor} flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300`}
            >
              <node.icon className="w-10 h-10 text-white" />
            </motion.div>
            <span className="text-sm font-medium text-center">{node.label}</span>
            
            {/* Flecha animada (solo en desktop entre nodos) */}
            {index < nodes.length - 1 && (
              <div className="hidden md:block absolute" style={{ left: `${(index + 1) * 25 - 5}%`, top: '35%' }}>
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-cyan-500/50 text-2xl font-bold"
                >
                  →
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Flujo Automatizado en Tiempo Real</span>
        </div>
      </div>
    </div>
  );
};

export default AIFlowDiagram;