import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fb]">
      <Header />

      <main className="flex-1 pb-12">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
