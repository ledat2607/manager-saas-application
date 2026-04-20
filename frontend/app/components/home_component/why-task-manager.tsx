import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
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

const FeatureCard = ({
  item,
  index,
  t,
}: {
  item: any;
  index: number;
  t: any;
}) => {
  const Icon = item.icon;
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      key={index}
      onMouseMove={handleMouseMove}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative transition-all duration-300"
      whileHover={{ y: -8 }}
    >
      {/* Hiệu ứng Border Glow đuổi theo chuột */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <GlassCard className="relative h-full p-8 border-white/5 bg-white/2">
        <div className="flex flex-col items-start gap-5">
          {/* Icon Box với hiệu ứng xoay nhẹ khi hover */}
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="rounded-2xl bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20"
          >
            <Icon className="h-7 w-7 text-indigo-400" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              {t(item.titleKey)}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground/80">
              {t(item.descKey)}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function WhyTaskManager() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ===== Title ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-20 max-w-3xl text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
        >
          Features
        </motion.span>
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-foreground">
          Why
          <span className="bg-linear-to-r mx-3 from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent italic">
            Task Manager
          </span>
          ?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground/70 max-w-xl mx-auto">
          {t("whyReason")}
        </p>
      </motion.div>

      {/* ===== Features Grid ===== */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((item, index) => (
          <FeatureCard key={index} item={item} index={index} t={t} />
        ))}
      </motion.div>
    </section>
  );
}
