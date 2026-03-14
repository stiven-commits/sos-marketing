import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LegalProps {
  title: string;
  content: ReactNode;
}

const Legal = ({ title, content }: LegalProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-16 container mx-auto px-4 max-w-4xl text-muted-foreground leading-relaxed">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{title}</h1>
        {content}
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
