import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import RegionalReach from "@/components/RegionalReach";
import ProjectHighlights from "@/components/ProjectHighlights";
import TrustedBy from "@/components/TrustedBy";
import WhyChoose from "@/components/WhyChoose";
import Founder from "@/components/Founder";
import Testimonials from "@/components/Testimonials";
import GetStarted from "@/components/GetStarted";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Process />
        <Industries />
        <RegionalReach />
        <ProjectHighlights />
        <TrustedBy />
        <WhyChoose />
        <Founder />
        <Testimonials />
        <GetStarted />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
