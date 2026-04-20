import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle, LayoutList, BarChart3, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlassCard } from "./glass-chart";

const steps = [
  {
    icon: LayoutList,
    title: "features.createTask.title",
    desc: "features.createTask.des",
    color: "text-blue-400",
  },
  {
    icon: CheckCircle,
    title: "features.focus.title",
    desc: "features.focus.des",
    color: "text-indigo-400",
  },
  {
    icon: BarChart3,
    title: "features.tracking.title",
    desc: "features.tracking.des",
    color: "text-purple-400",
  },
  {
    icon: Sparkles,
    title: "features.finish.title",
    desc: "features.finish.des",
    color: "text-pink-400",
  },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-500/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-24 max-w-2xl text-center"
      >
        <h2 className="text-4xl font-black tracking-tight md:text-5xl">
          How{" "}
          <span className="italic bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            It Works
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground/80 leading-relaxed">
          {t("how")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
        {/* LEFT – Steps list with Progress Line */}
        <div className="relative flex flex-col gap-8">
          {/* Đường line chạy dọc nối các bước */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-indigo-500/50 to-transparent hidden md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group relative pl-0 md:pl-12"
              >
                {/* Dot trên đường line */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-500 z-10 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]" />

                <GlassCard className="p-6 transition-all duration-300 group-hover:bg-white/[0.05] group-hover:border-indigo-500/30">
                  <div className="flex items-center gap-6">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900/50 border border-white/10 group-hover:border-indigo-500/50 transition-colors shadow-inner`}
                    >
                      <Icon className={`h-7 w-7 ${step.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {t(step.title)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {t(step.desc)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT – Interactive Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Hiệu ứng Glow phía sau Mockup */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <GlassCard className="relative z-10 p-8 border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
                Live Workflow
              </p>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  task: "Create task",
                  status: "Todo",
                  color: "bg-blue-500/20 text-blue-400",
                },
                {
                  task: "Design dashboard",
                  status: "In Progress",
                  color: "bg-amber-500/20 text-amber-400",
                },
                {
                  task: "Deploy app",
                  status: "Done",
                  color: "bg-emerald-500/20 text-emerald-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    x: 5,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all"
                >
                  <span className="font-medium">{item.task}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.color}`}
                  >
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Thêm một thành phần trang trí nhỏ bên dưới */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-50">
              <div className="h-2 w-24 bg-white/10 rounded-full" />
              <div className="h-8 w-8 rounded-lg bg-white/10" />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
