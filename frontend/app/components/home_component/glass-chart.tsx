import { motion } from "framer-motion";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
/* ================= MOCK DATA ================= */
const chartData = [
  { day: "Mon", done: 30 },
  { day: "Tue", done: 42 },
  { day: "Wed", done: 38 },
  { day: "Thu", done: 55 },
  { day: "Fri", done: 72 },
];

/* ================= GLASS CARD ================= */
export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative rounded-2xl
        bg-white/10 dark:bg-black/30
        backdrop-blur-xl
        border border-white/15
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)]
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-linear-to-br before:from-white/20 before:to-transparent
        before:opacity-40 before:pointer-events-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ================= CHART CARD ================= */
export const GlassChart = () => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  >
    <GlassCard className="h-64 p-5">
      <p className="mb-3 text-sm font-medium text-foreground">
        Weekly Task Progress
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="day" hide />
          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="done"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={false}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  </motion.div>
);
