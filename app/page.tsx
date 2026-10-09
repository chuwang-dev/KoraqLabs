import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { Services } from "@/components/services";
import { Industries } from "@/components/industries";
import { Portfolio } from "@/components/portfolio";
import { Process } from "@/components/process";
import { Pricing } from "@/components/pricing";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { ContactSection } from "@/components/contact-section";
import { getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const { content } = await getSiteContent();
  const renderSection = (section: string) => {
    switch (section) {
      case "hero": return <Hero key={section} content={content} />;
      case "about": return <AboutSection key={section} />;
      case "services": return <Services key={section} content={content} />;
      case "industries": return <Industries key={section} content={content} />;
      case "portfolio": return <Portfolio key={section} content={content} />;
      case "process": return <Process key={section} content={content} />;
      case "pricing": return <Pricing key={section} content={content} />;
      case "whyUs": return <WhyUs key={section} content={content} />;
      case "testimonials": return <Testimonials key={section} content={content} />;
      case "faq": return <Faq key={section} content={content} />;
      case "contact": return <ContactSection key={section} content={content} />;
      default: return null;
    }
  };
  const sectionOrder = content.home.sectionOrder.filter(
    (section, index, sections) => sections.indexOf(section) === index
  );

  return (
    <>{sectionOrder.map(renderSection)}</>
  );
}
