import NavBarUser from "@/components/home_component/nav-bar";
import WhyTaskManager from "@/components/home_component/why-task-manager";
import HowItWorks from "@/components/home_component/how-it-works";
import Testimonials from "@/components/home_component/testimonials";
import FinalCTA from "@/components/home_component/cta";
import Footer from "@/components/home_component/footer";
import Hero from "@/components/home_component/hero";
import type { Route } from "./+types/home";
import { userAuth } from "@/provider/auth-context";

/* ================= TITLE ================= */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager - Quản lý công việc hiệu quả" },
    {
      name: "description",
      content: "Nền tảng quản lý task tối ưu cho nhóm nhỏ.",
    },
    { property: "og:image", content: "/og-image.png" }, // Ảnh xem trước
    { property: "og:type", content: "website" },
  ];
}

/* ================= HOME PAGE ================= */
const HomePage = () => {
  const { user } = userAuth();

  return (
    <div className="flex flex-col space-y-24 justify-between w-full">
      <NavBarUser user={user} />

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
