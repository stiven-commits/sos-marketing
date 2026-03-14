import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HashScroll from "@/components/HashScroll";
import Index from "./pages/Index.tsx";
import PlanesRedesSociales from "./pages/PlanesRedesSociales.tsx";
import RedesSociales from "./pages/RedesSociales.tsx";
import MetaAds from "./pages/MetaAds.tsx";
import DisenoGrafico from "./pages/DisenoGrafico.tsx";
import DesarrolloWeb from "./pages/DesarrolloWeb.tsx";
import Fotografia from "./pages/Fotografia.tsx";
import ProduccionVideo from "./pages/ProduccionVideo.tsx";
import IAAutomation from "./pages/IAAutomation";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HashScroll />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planes-redes-sociales" element={<PlanesRedesSociales />} />
          <Route path="/servicios/redes-sociales" element={<RedesSociales />} />
          <Route path="/servicios/meta-ads" element={<MetaAds />} />
          <Route path="/servicios/diseno-grafico" element={<DisenoGrafico />} />
          <Route path="/servicios/desarrollo-web" element={<DesarrolloWeb />} />
          <Route path="/servicios/fotografia" element={<Fotografia />} />
          <Route path="/servicios/produccion-video" element={<ProduccionVideo />} />
          <Route path="/servicios/ia-automatizacion" element={<IAAutomation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
