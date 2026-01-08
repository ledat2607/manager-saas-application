import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FinalCTA() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-12 text-center backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(99,102,241,0.6)]"
      >
        {/* Gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-indigo-500/20 via-sky-500/20 to-purple-500/20 blur-3xl" />

        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to
          <span className="ml-2 bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
            Get Things Done?
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Start organizing your tasks, tracking progress, and boosting
          productivity today.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-indigo-500 px-8 py-4 font-medium text-white shadow-lg hover:bg-indigo-600"
          >
            Get Started Free
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-medium backdrop-blur-md hover:bg-white/20"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
