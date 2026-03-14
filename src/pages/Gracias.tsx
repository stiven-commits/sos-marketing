import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Gracias = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="container mx-auto px-4 flex flex-col items-center justify-center pt-32 pb-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-6 mx-auto" />
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              ¡Mensaje Enviado con Éxito!
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hemos recibido tu información. Un especialista de SOS Marketing se pondrá en contacto contigo muy
              pronto para conversar sobre tu proyecto.
            </p>
            <Link
              to="/"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition mt-8 inline-block"
            >
              Volver al Inicio
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Gracias;
