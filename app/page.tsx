import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Industries } from "@/components/industries";
import { Portfolio } from "@/components/portfolio";
import { Process } from "@/components/process";
import { Pricing } from "@/components/pricing";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Industries />
      <Portfolio />
      <Process />
      <Pricing />
      <WhyUs />
      <Testimonials />
      <Faq />
      <ContactSection />
    </>
  );
}
