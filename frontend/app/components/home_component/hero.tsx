import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GlassCard, GlassChart } from "./glass-chart";

const StatCard = ({ title, value, delay }: { title: string; value: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -10, 0] }}
    transition={{
      opacity: { duration: 0.6, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
    }}
  >
    <GlassCard className="p-5 border-white/10 hover:border-blue-500/30 transition-colors">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
        {value}
      </p>
    </GlassCard>
  </motion.div>
);

const Hero = () => {
  const { t } = useTranslation();
  
  // Logic tạo hiệu ứng nghiêng theo chuột (Parallax)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div 
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Glows - Tạo các đốm sáng mờ ảo phía sau */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 items-center max-w-7xl mx-auto px-6 gap-16 lg:grid-cols-2">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New v2.0 is out
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl leading-[1.1]">
            <span className="text-foreground block">{t("slogan")}</span>
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent italic">
              Task Manager
            </span>
          </h1>

          <p className="mt-8 text-lg text-muted-foreground/80 md:text-xl max-w-xl leading-relaxed">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("homeBtn")}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold backdrop-blur-xl transition-all"
            >
              {t("learnBtn")}
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT VISUAL - Với hiệu ứng nghiêng 3D */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="relative mx-auto flex w-full max-w-lg flex-col gap-6"
        >
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />
          
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <GlassChart />
          </motion.div>

          <div className="grid grid-cols-2 gap-6 relative z-20">
            <StatCard title="Tasks Done" value="128" delay={0.4} />
            <StatCard title="In Progress" value="24" delay={0.6} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;