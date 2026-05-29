import { Hero } from "@/components/hero/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { WorkGrid } from "@/components/sections/work-grid";
import { Experience } from "@/components/sections/experience";
import { Marquee } from "@/components/sections/marquee";
import { Footer } from "@/components/chrome/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <WorkGrid />
      <Experience />
      <Marquee />
      <Footer />
    </main>
  );
}
