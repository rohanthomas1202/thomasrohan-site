import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Offers } from "@/components/sections/offers";
import { About } from "@/components/sections/about";
import { NowLine } from "@/components/now-line";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <GitHubActivity />
      <Offers />
      <About />
      <NowLine />
      <Footer />
    </main>
  );
}
