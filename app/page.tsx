import { Duos } from "@/components/Duos";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Founder } from "@/components/Founder";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProviderBand } from "@/components/ProviderBand";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Duos />
        <HowItWorks />
        <Founder />
        <ProviderBand />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
