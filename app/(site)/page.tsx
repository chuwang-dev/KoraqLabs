import { Hero } from "@/components/sections/hero";
import { CapabilityStrip } from "@/components/sections/capability-strip";
import { Services } from "@/components/sections/services";
import { WhyUs } from "@/components/sections/why-us";
import { Portfolio } from "@/components/sections/portfolio";
import { Process } from "@/components/sections/process";
import { Industries } from "@/components/sections/industries";
import { Pricing } from "@/components/sections/pricing";
import { Technology } from "@/components/sections/technology";
import { GrowthPath } from "@/components/sections/growth-path";
import { AboutPreview } from "@/components/sections/about-preview";
import { BrochureCta } from "@/components/sections/brochure-cta";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <Services />
      <WhyUs />
      <Portfolio />
      <Process />
      <Industries />
      <Pricing />
      <Technology />
      <GrowthPath />
      <AboutPreview />
      <BrochureCta />
      <Faq />
      <Contact />
    </>
  );
}
