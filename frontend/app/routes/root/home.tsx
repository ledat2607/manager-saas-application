import NavBarUser from "@/components/home_component/nav-bar";
import WhyTaskManager from "@/components/home_component/why-task-manager";
import HowItWorks from "@/components/home_component/how-it-works";
import Testimonials from "@/components/home_component/testimonials";
import FinalCTA from "@/components/home_component/cta";
import Footer from "@/components/home_component/footer";
import type { Route } from "./+types/home";
import Hero from "@/components/home_component/hero";

/* ================= TITLE ================= */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager" },
    { name: "description", content: "Welcome to Task Manager Application!" },
  ];
}

/* ================= HOME PAGE ================= */
const HomePage = () => {

  return (
    <div className="flex flex-col space-y-24 justify-between w-full">
      <NavBarUser />

      {/* ===== Hero Section ===== */}
      <Hero />
      {/* ===== Why Task Manager ===== */}
      <WhyTaskManager />

      {/*How it work Component */}
      <HowItWorks />

      {/*Use case */}
      <Testimonials />
      {/*CTA */}
      <FinalCTA />

      {/**Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
