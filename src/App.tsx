import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HashScroll from "@/components/HashScroll";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index.tsx";
import PlanesRedesSociales from "./pages/PlanesRedesSociales.tsx";
import RedesSociales from "./pages/RedesSociales.tsx";
import MetaAds from "./pages/MetaAds.tsx";
import DisenoGrafico from "./pages/DisenoGrafico.tsx";
import DesarrolloWeb from "./pages/DesarrolloWeb.tsx";
import Fotografia from "./pages/Fotografia.tsx";
import ProduccionVideo from "./pages/ProduccionVideo.tsx";
import IAAutomation from "./pages/IAAutomation";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HashScroll />
        <CookieConsent />
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
          <Route path="/privacy-policy" element={<Legal title="Privacy Policy" content={<div className="space-y-6">
  <p><strong>Last updated: January 13, 2022</strong></p>
  <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
  <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
  
  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Interpretation and Definitions</h2>
  <ul className="list-disc pl-6 space-y-2">
    <li><strong>Company:</strong> refers to Desarrollo y diseño SOS 2014, Av. Los Salias, Venezuela.</li>
    <li><strong>Cookies:</strong> are small files that are placed on Your computer, mobile device or any other device by a website.</li>
    <li><strong>Device:</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
    <li><strong>Personal Data:</strong> is any information that relates to an identified or identifiable individual.</li>
    <li><strong>Service:</strong> refers to the Website (https://sosmarketing.agency/).</li>
  </ul>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Collecting and Using Your Personal Data</h2>
  <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You, including: Email address, First name and last name, Phone number, and Usage Data.</p>
  <p>Usage Data is collected automatically when using the Service and may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, and other diagnostic data.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Use of Your Personal Data</h2>
  <p>The Company may use Personal Data to provide and maintain our Service, manage Your Account, contact You via email, telephone calls, or SMS regarding updates or informative communications, and to provide You with news, special offers and general information about other services.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Transfer and Security of Your Personal Data</h2>
  <p>Your information, including Personal Data, is processed at the Company's operating offices. The Company will take all steps reasonably necessary to ensure that Your data is treated securely. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, You can contact us:</p>
  <ul className="list-disc pl-6 space-y-2">
    <li>By email: <strong>atencion@sosmarketing.agency</strong></li>
    <li>By phone: <strong>+58 414-0170980</strong></li>
  </ul>
</div>} />} />
          <Route path="/cookie-policy" element={<Legal title="Pol�tica de Cookies" content={<div className="space-y-6">
  <p><em>This page applies to citizens and legal permanent residents of the United States and the European Union.</em></p>
  
  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
  <p>Our website, <strong>https://sosmarketing.agency</strong> uses cookies and other related technologies (for convenience all technologies are referred to as "cookies"). Cookies are also placed by third parties we have engaged.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. "Do Not Sell or Share My Personal Information" (CCPA/CPRA)</h2>
  <p>We do not sell or share personal information to third parties for monetary consideration; however, we may disclose certain personal information to third parties (like Google Ads or Meta) under circumstances that might be deemed a "sale" or "sharing" for residents of California (CPRA) and other regions.</p>
  <p>We respect and understand that you may want to be sure that your personal information is not being sold or shared. If you wish to opt-out of cross-context behavioral advertising, you can clear your browser cookies or use the Cookie Consent banner provided on this site to decline marketing cookies.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How we use Cookies</h2>
  <ul className="list-disc pl-6 space-y-4">
    <li>
      <strong>Technical or functional cookies:</strong> Some cookies ensure that certain parts of the website work properly and that your user preferences remain known. We may place these cookies without your consent.
    </li>
    <li>
      <strong>Statistics cookies:</strong> We use statistics cookies (like Google Analytics) to optimize the website experience for our users and get insights into the usage of our website.
    </li>
    <li>
      <strong>Marketing/Tracking cookies:</strong> Marketing/Tracking cookies (like Meta Pixel) are used to create user profiles to display advertising or to track the user on this website or across several websites for similar marketing purposes.
    </li>
    <li>
      <strong>Social media:</strong> On our website, we have included content to promote web pages or share on social networks. This content is embedded with code derived from third parties and places cookies.
    </li>
  </ul>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Enabling/disabling and deleting cookies</h2>
  <p>You can use your internet browser to automatically or manually delete cookies. You can also specify that certain cookies may not be placed. Another option is to change the settings of your internet browser so that you receive a message each time a cookie is placed. For more information about these options, please refer to the instructions in the Help section of your browser.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Contact Details</h2>
  <p>For questions and/or comments about our Cookie Policy and this statement, please contact us by using the following details:</p>
  <p>Email: <strong>atencion@sosmarketing.agency</strong></p>
</div>} />} />
          <Route path="/opt-out-preferences" element={<Legal title="Opt-Out Preferences / Do Not Sell My Info" content={<div className="space-y-6">
  <p><em>This page applies to citizens and legal permanent residents of the United States and the European Union.</em></p>
  
  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
  <p>Our website, <strong>https://sosmarketing.agency</strong> uses cookies and other related technologies (for convenience all technologies are referred to as "cookies"). Cookies are also placed by third parties we have engaged.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. "Do Not Sell or Share My Personal Information" (CCPA/CPRA)</h2>
  <p>We do not sell or share personal information to third parties for monetary consideration; however, we may disclose certain personal information to third parties (like Google Ads or Meta) under circumstances that might be deemed a "sale" or "sharing" for residents of California (CPRA) and other regions.</p>
  <p>We respect and understand that you may want to be sure that your personal information is not being sold or shared. If you wish to opt-out of cross-context behavioral advertising, you can clear your browser cookies or use the Cookie Consent banner provided on this site to decline marketing cookies.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How we use Cookies</h2>
  <ul className="list-disc pl-6 space-y-4">
    <li>
      <strong>Technical or functional cookies:</strong> Some cookies ensure that certain parts of the website work properly and that your user preferences remain known. We may place these cookies without your consent.
    </li>
    <li>
      <strong>Statistics cookies:</strong> We use statistics cookies (like Google Analytics) to optimize the website experience for our users and get insights into the usage of our website.
    </li>
    <li>
      <strong>Marketing/Tracking cookies:</strong> Marketing/Tracking cookies (like Meta Pixel) are used to create user profiles to display advertising or to track the user on this website or across several websites for similar marketing purposes.
    </li>
    <li>
      <strong>Social media:</strong> On our website, we have included content to promote web pages or share on social networks. This content is embedded with code derived from third parties and places cookies.
    </li>
  </ul>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Enabling/disabling and deleting cookies</h2>
  <p>You can use your internet browser to automatically or manually delete cookies. You can also specify that certain cookies may not be placed. Another option is to change the settings of your internet browser so that you receive a message each time a cookie is placed. For more information about these options, please refer to the instructions in the Help section of your browser.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Contact Details</h2>
  <p>For questions and/or comments about our Cookie Policy and this statement, please contact us by using the following details:</p>
  <p>Email: <strong>atencion@sosmarketing.agency</strong></p>
</div>} />} />
          <Route path="/disclaimer" element={<Legal title="Disclaimer" content={<div className="space-y-6">
  <p><strong>Última actualización: {new Date().getFullYear()}</strong></p>
  <p>La información contenida en <strong>https://sosmarketing.agency</strong> (el "Servicio") es solo para fines de información general. SOS Marketing Digital no asume ninguna responsabilidad por errores u omisiones en el contenido del Servicio.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Garantía de Resultados</h2>
  <p>El marketing digital, publicidad en redes sociales (Meta Ads) y el posicionamiento web dependen de múltiples factores externos, incluyendo cambios en algoritmos de terceros y condiciones del mercado. Aunque aplicamos estrategias probadas y profesionales, <strong>no podemos garantizar resultados exactos de ventas, alcance o Retorno de Inversión (ROI)</strong>. Los casos de éxito presentados son ejemplos reales, pero los resultados individuales pueden variar.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Afiliación con Terceros</h2>
  <p>SOS Marketing Digital es una agencia independiente. No estamos afiliados, asociados, autorizados, respaldados ni conectados oficialmente de ninguna manera con <strong>Meta Platforms, Inc. (Facebook, Instagram, WhatsApp), Google LLC, OpenAI, n8n</strong>, ni con ninguna de sus subsidiarias o afiliadas. Los nombres, marcas, emblemas e imágenes de estas plataformas son marcas registradas de sus respectivos dueños.</p>

  <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Enlaces Externos</h2>
  <p>Nuestro Servicio puede contener enlaces a sitios web externos que no son proporcionados ni mantenidos por nosotros. Ten en cuenta que SOS Marketing Digital no garantiza la precisión, relevancia, actualidad o integridad de cualquier información en estos sitios web externos.</p>

  <p className="mt-8">Si tienes preguntas sobre este descargo de responsabilidad, contáctanos en: <strong>atencion@sosmarketing.agency</strong></p>
</div>} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
