import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Koraq Labs what you're trying to build. We'll help you determine the right digital solution.",
};

export default function ContactPage() {
  return (
    <>
      <Contact />
      <Faq />
    </>
  );
}
