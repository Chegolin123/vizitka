import Background from "@/components/ui/Background";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import TechMarquee from "@/components/sections/TechMarquee";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import WhyMe from "@/components/sections/WhyMe";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main id="main">
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <WhyMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
