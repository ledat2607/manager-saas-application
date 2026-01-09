import { motion } from "framer-motion";
import { CheckCircle, Clock, BarChart3, Sparkles } from "lucide-react";
import { GlassCard } from "./glass-chart";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: CheckCircle,
    titleKey: "features.organized.title",
    descKey: "features.organized.desc",
  },
  {
    icon: Clock,
    titleKey: "features.time.title",
    descKey: "features.time.desc",
  },
  {
    icon: BarChart3,
    titleKey: "features.progress.title",
    descKey: "features.progress.desc",
  },
  {
    icon: Sparkles,
    titleKey: "features.simple.title",
    descKey: "features.simple.desc",
  },
];

export default function WhyTaskManager() {
  const { t } = useTranslation();
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 ">
      {/* ===== Title ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Why
          <span className="bg-linear-to-r ml-2 from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
            Task Manager
          </span>
          ?
        </h2>
        <p className="mt-4 text-muted-foreground">{t("whyReason")}</p>
      </motion.div>

      {/* ===== Features Grid ===== */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              <GlassCard className="h-full p-6">
                <div className="flex flex-col items-start gap-4">
                  <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md">
                    <Icon className="h-6 w-6 text-indigo-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">
                    {t(item.titleKey)}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t(item.descKey)}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
