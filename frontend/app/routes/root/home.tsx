import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GlassCard, GlassChart } from "@/components/home_component/glass-chart";
import NavBarUser from "@/components/home_component/nav-bar";
import WhyTaskManager from "@/components/home_component/why-task-manager";
import HowItWorks from "@/components/home_component/how-it-works";
import Testimonials from "@/components/home_component/testimonials";
import FinalCTA from "@/components/home_component/cta";
import Footer from "@/components/home_component/footer";
import type { Route } from "./+types/home";

/* ================= TITLE ================= */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager" },
    { name: "description", content: "Welcome to Task Manager Application!" },
  ];
}

/* ================= STATS CARD ================= */
const StatCard = ({ title, value }: { title: string; value: string }) => (
  <GlassCard className="p-5">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">
      {title}
    </p>
    <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
  </GlassCard>
);

/* ================= HOME PAGE ================= */
const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="h-screen flex flex-col space-y-16 justify-between">
        <NavBarUser />

        {/* ===== Hero Section ===== */}
        <div className="p-4 z-10 grid grid-cols-1 items-center max-w-6xl mx-auto gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto text-center lg:text-left"
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl space-x-2">
              <span className="text-foreground">{t("slogan")}</span>

              <span className="bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
                Task Manager
              </span>
            </h1>

            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition hover:shadow-primary/30 cursor-pointer"
              >
                {t("homeBtn")}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
              >
                {t("learnBtn")}
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mx-auto flex w-full max-w-md flex-col gap-6"
          >
            <GlassChart />

            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Tasks Done" value="128" />
              <StatCard title="In Progress" value="24" />
            </div>
          </motion.div>
        </div>

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
    </>
  );
};

export default HomePage;
