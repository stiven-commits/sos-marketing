import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

type Region = "EU" | "US" | "OTHER";

const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [region, setRegion] = useState<Region>("OTHER");

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie_consent");
    if (savedConsent) return;

    const detectRegion = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryCode = String(data?.country_code || "").toUpperCase();

        if (data?.in_eu === true || EU_COUNTRIES.has(countryCode)) {
          setRegion("EU");
        } else if (countryCode === "US") {
          setRegion("US");
        } else {
          setRegion("OTHER");
        }
      } catch {
        setRegion("OTHER");
      } finally {
        setIsVisible(true);
      }
    };

    detectRegion();
  }, []);

  const handleConsent = (value: string) => {
    localStorage.setItem("cookie_consent", value);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm glass-panel p-6 rounded-2xl shadow-2xl border border-white/10"
        >
          <button
            type="button"
            aria-label="Cerrar aviso de cookies"
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => handleConsent("dismissed")}
          >
            <X className="w-4 h-4" />
          </button>

          {region === "EU" && (
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-lg font-semibold">Privacidad y Cookies (GDPR)</h3>
              <p className="text-sm text-muted-foreground">
                Usamos cookies para mejorar tu experiencia, analizar tráfico y personalizar contenido.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleConsent("accepted")}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent("rejected")}
                  className="px-4 py-2 rounded-lg border border-white/20 text-sm text-foreground hover:bg-white/10 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </div>
          )}

          {region === "US" && (
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-lg font-semibold">Do Not Sell My Info (CCPA)</h3>
              <p className="text-sm text-muted-foreground">
                California and U.S. residents can control privacy settings and opt out of data sharing preferences.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleConsent("accepted")}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Accept
                </button>
                <Link
                  to="/opt-out-preferences"
                  onClick={() => handleConsent("opt_out_requested")}
                  className="px-4 py-2 rounded-lg border border-white/20 text-sm text-foreground hover:bg-white/10 transition-colors"
                >
                  Opt-Out Preferences
                </Link>
              </div>
            </div>
          )}

          {region === "OTHER" && (
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-lg font-semibold">Aviso de Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Este sitio utiliza cookies para ofrecer una mejor experiencia de navegación.
              </p>
              <button
                type="button"
                onClick={() => handleConsent("acknowledged")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Entendido
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
