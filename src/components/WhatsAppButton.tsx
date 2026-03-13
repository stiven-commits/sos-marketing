import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/+584140170980"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
      aria-label="Habla con nosotros"
    >
      <MessageCircle className="w-6 h-6 text-foreground" fill="currentColor" />
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-card text-foreground text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Habla con nosotros
      </span>
    </a>
  );
};

export default WhatsAppButton;
