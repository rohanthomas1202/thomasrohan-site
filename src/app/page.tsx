import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { NowLine } from "@/components/now-line";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <NowLine />
      <Footer />
    </main>
  );
}
