import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ServicesOverview />
      <Process />
      <WhyChooseUs />
      <CTASection />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
