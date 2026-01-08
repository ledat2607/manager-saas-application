import { motion } from "framer-motion";
import { CheckCircle, LayoutList, BarChart3, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlassCard } from "./glass-chart";
import CircuitBackground from "./background";

const steps = [
  {
    icon: LayoutList,
    title: "features.createTask.title",
    desc: "features.createTask.des",
  },
  {
    icon: CheckCircle,
    title: "features.focus.title",
    desc: "features.focus.des",
  },
  {
    icon: BarChart3,
    title: "features.tracking.title",
    desc: "features.tracking.des",
  },
  {
    icon: Sparkles,
    title: "features.finish.title",
    desc: "features.finish.des",
  },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      {/* ===== Title ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-20 max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          How
          <span className="ml-2 bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
            It Works
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">{t("how")}</p>
      </motion.div>

      {/* ===== Steps ===== */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* LEFT – Steps list */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex flex-col gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -4 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/25 backdrop-blur-md">
                      <Icon className="h-6 w-6 text-indigo-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {t(step.title)}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(step.desc)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* RIGHT – Visual mock */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <CircuitBackground />

          <GlassCard className="relative z-10 p-6">
            <p className="text-sm font-semibold">Your Workflow</p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span>Create task</span>
                <span className="text-xs text-muted-foreground">Todo</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span>Design dashboard</span>
                <span className="text-xs text-muted-foreground">
                  In Progress
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span>Deploy app</span>
                <span className="text-xs text-muted-foreground">Done</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
