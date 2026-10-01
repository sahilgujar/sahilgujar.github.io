import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ContributionGraph } from "@/components/ContributionGraph";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Footer } from "@/components/Footer";
import { Reveals } from "@/components/Reveals";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="mx-auto max-w-[1040px] px-5">
        <Hero />
        <ContributionGraph />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
