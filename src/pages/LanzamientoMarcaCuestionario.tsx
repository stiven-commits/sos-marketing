import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type BuyerType = "B2B" | "B2C" | "Hibrido";

type FormState = {
  nombreProducto: string;
  promesa9s: string;
  composicion: string;
  diferenciador: string;
  certificaciones: string;
  situacionActual: string;
  competenciaLocal: string;
  ventajaCompetitiva: string;
  compradorPrincipal: BuyerType | "";
  perfil: string;
  ciudadesFoco: string;
  metaCortoPlazo: string;
  canalesVenta: string;
  logisticaEnvio: string;
  personalidadMarca: string;
  recursosVisuales: string;
  presupuestoInversion: string;
};

const initialForm: FormState = {
  nombreProducto: "",
  promesa9s: "",
  composicion: "",
  diferenciador: "",
  certificaciones: "",
  situacionActual: "",
  competenciaLocal: "",
  ventajaCompetitiva: "",
  compradorPrincipal: "",
  perfil: "",
  ciudadesFoco: "",
  metaCortoPlazo: "",
  canalesVenta: "",
  logisticaEnvio: "",
  personalidadMarca: "",
  recursosVisuales: "",
  presupuestoInversion: "",
};

const LanzamientoMarcaCuestionario = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetId = useRef<number | null>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!recaptchaSiteKey) {
      return;
    }

    const markReady = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => setIsRecaptchaReady(true));
        return;
      }

      if (typeof window.grecaptcha?.render === "function") {
        setIsRecaptchaReady(true);
      }
    };

    const currentScript = document.querySelector<HTMLScriptElement>('script[src*="recaptcha/api.js"]');
    if (currentScript) {
      if (window.grecaptcha) {
        markReady();
      } else {
        currentScript.addEventListener("load", markReady, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = markReady;
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  useEffect(() => {
    if (!isRecaptchaReady || !window.grecaptcha || !recaptchaRef.current || recaptchaWidgetId.current !== null || !recaptchaSiteKey) {
      return;
    }

    if (typeof window.grecaptcha.render !== "function") {
      setFormError("No se pudo inicializar reCAPTCHA. Recarga la pagina e intenta de nuevo.");
      return;
    }

    recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
      sitekey: recaptchaSiteKey,
      callback: (token: string) => {
        setRecaptchaToken(token);
        setFormError("");
      },
      "expired-callback": () => setRecaptchaToken(""),
      "error-callback": () => setRecaptchaToken(""),
    });
  }, [isRecaptchaReady, recaptchaSiteKey]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!recaptchaSiteKey) {
      setFormError("No se configuro reCAPTCHA en el sitio.");
      return;
    }

    if (!recaptchaToken) {
      setFormError("Completa la verificacion reCAPTCHA.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cuestionario-lanzamiento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setFormError(data?.error || "No se pudo enviar el cuestionario.");
        return;
      }

      setForm(initialForm);
      setRecaptchaToken("");
      if (window.grecaptcha && recaptchaWidgetId.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      }
      navigate("/gracias");
    } catch {
      setFormError("Ocurrio un error de red al enviar el cuestionario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden grid-bg">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-5"
          >
            Cuestionario de <span className="gradient-text">Lanzamiento de Marca</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-3xl mx-auto"
          >
            Este documento recolecta la informacion clave para disenar un plan de marketing solido y adaptado al mercado venezolano para el nuevo tratamiento de alisado instantaneo (9 segundos).
          </motion.p>
        </div>
      </section>

      <section className="py-10 lg:py-16 relative section-glow">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-panel rounded-2xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-8"
          >
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl">1. El Producto y su Promesa Estrella</h2>
              <p className="text-sm text-muted-foreground">Esta seccion define el corazon de la estrategia.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="nombre-producto" className="text-sm font-medium">Cual es el nombre comercial del producto?</label>
                <input id="nombre-producto" type="text" required value={form.nombreProducto} onChange={(e) => updateField("nombreProducto", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="promesa-9s" className="text-sm font-medium">La promesa de los 9 segundos: Podrias explicarnos tecnicamente que sucede en esos 9 segundos?</label>
                <textarea id="promesa-9s" rows={4} required value={form.promesa9s} onChange={(e) => updateField("promesa9s", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="composicion" className="text-sm font-medium">Composicion tecnica: Cuales son los ingredientes principales? Es libre de formol/formaldehido?</label>
                <textarea id="composicion" rows={4} required value={form.composicion} onChange={(e) => updateField("composicion", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="diferenciador" className="text-sm font-medium">Diferenciador clave: por que deberia elegir este alisado sobre otros?</label>
                <textarea id="diferenciador" rows={4} required value={form.diferenciador} onChange={(e) => updateField("diferenciador", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="certificaciones" className="text-sm font-medium">Certificaciones: cuenta con registros internacionales? En que fase de registro sanitario se encuentra para Venezuela?</label>
                <textarea id="certificaciones" rows={4} required value={form.certificaciones} onChange={(e) => updateField("certificaciones", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="font-heading font-bold text-2xl">2. El Mercado y la Competencia</h2>
              <p className="text-sm text-muted-foreground">Entendiendo el entorno donde vamos a competir.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="situacion-actual" className="text-sm font-medium">Situacion actual: el producto ya se encuentra fisicamente en Venezuela o estamos en fase de preventa/importacion?</label>
                <textarea id="situacion-actual" rows={3} required value={form.situacionActual} onChange={(e) => updateField("situacionActual", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="competencia-local" className="text-sm font-medium">Competencia local: que marcas de alisado son las mas usadas actualmente? (menciona al menos 3).</label>
                <textarea id="competencia-local" rows={3} required value={form.competenciaLocal} onChange={(e) => updateField("competenciaLocal", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="ventaja-competitiva" className="text-sm font-medium">Ventaja competitiva: cual es el mayor beneficio para la mujer venezolana?</label>
                <textarea id="ventaja-competitiva" rows={3} required value={form.ventajaCompetitiva} onChange={(e) => updateField("ventajaCompetitiva", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="font-heading font-bold text-2xl">3. El Cliente Ideal (Buyer Persona)</h2>
              <p className="text-sm text-muted-foreground">A quien le vamos a hablar en nuestras campanas?</p>
            </div>

            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Quien es el comprador principal?</legend>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <label className="flex items-start gap-2"><input type="radio" name="comprador" value="B2B" className="mt-1" checked={form.compradorPrincipal === "B2B"} onChange={(e) => updateField("compradorPrincipal", e.target.value as BuyerType)} required />B2B: Duenos de salones y estilistas.</label>
                  <label className="flex items-start gap-2"><input type="radio" name="comprador" value="B2C" className="mt-1" checked={form.compradorPrincipal === "B2C"} onChange={(e) => updateField("compradorPrincipal", e.target.value as BuyerType)} required />B2C: Mujer final que compra para uso en casa o peluqueria.</label>
                  <label className="flex items-start gap-2"><input type="radio" name="comprador" value="Hibrido" className="mt-1" checked={form.compradorPrincipal === "Hibrido"} onChange={(e) => updateField("compradorPrincipal", e.target.value as BuyerType)} required />Hibrido: Ambos.</label>
                </div>
              </fieldset>

              <div className="space-y-2">
                <label htmlFor="perfil" className="text-sm font-medium">Perfil: a que tipo de mujer nos dirigimos?</label>
                <textarea id="perfil" rows={3} required value={form.perfil} onChange={(e) => updateField("perfil", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="ciudades" className="text-sm font-medium">Ciudades foco: lanzamiento en ciudad especifica o nacional?</label>
                <input id="ciudades" type="text" required value={form.ciudadesFoco} onChange={(e) => updateField("ciudadesFoco", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="font-heading font-bold text-2xl">4. Objetivos de Negocio y Logistica</h2>
              <p className="text-sm text-muted-foreground">Que queremos lograr y como lo vamos a vender?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="meta-corto" className="text-sm font-medium">Meta a corto plazo (3 meses): que resultado validaria el exito?</label>
                <textarea id="meta-corto" rows={3} required value={form.metaCortoPlazo} onChange={(e) => updateField("metaCortoPlazo", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="canales-venta" className="text-sm font-medium">Canales de venta: por que medio recibira el cliente el producto?</label>
                <textarea id="canales-venta" rows={3} required value={form.canalesVenta} onChange={(e) => updateField("canalesVenta", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="logistica-envio" className="text-sm font-medium">Logistica de envio: cuentan con sistema de delivery/envios nacionales?</label>
                <textarea id="logistica-envio" rows={3} required value={form.logisticaEnvio} onChange={(e) => updateField("logisticaEnvio", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="font-heading font-bold text-2xl">5. Identidad y Voz de Marca</h2>
              <p className="text-sm text-muted-foreground">Para definir la estetica y mensaje de los anuncios.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="personalidad" className="text-sm font-medium">Personalidad: si tu marca fuera una persona, como seria?</label>
                <textarea id="personalidad" rows={3} required value={form.personalidadMarca} onChange={(e) => updateField("personalidadMarca", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="recursos" className="text-sm font-medium">Recursos visuales: dispones de fotos, videos de antes/despues o tutoriales?</label>
                <textarea id="recursos" rows={3} required value={form.recursosVisuales} onChange={(e) => updateField("recursosVisuales", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>

              <div className="space-y-2">
                <label htmlFor="presupuesto" className="text-sm font-medium">Presupuesto de inversion mensual para pauta digital (Instagram/TikTok).</label>
                <input id="presupuesto" type="text" required value={form.presupuestoInversion} onChange={(e) => updateField("presupuestoInversion", e.target.value)} className="w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div ref={recaptchaRef} />
              {!recaptchaSiteKey && (
                <p className="text-xs text-destructive">Falta configurar VITE_RECAPTCHA_SITE_KEY en el entorno.</p>
              )}
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !recaptchaSiteKey}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Enviando..." : "Enviar cuestionario"}
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LanzamientoMarcaCuestionario;
