import { motion } from "framer-motion";

export default function CircuitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {/* Grid nền mờ */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Mạch điện chạy */}
      <motion.svg
        className="absolute inset-0"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M40 80 H200 V200 H340"
          stroke="url(#grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.path
          d="M80 320 V180 H260"
          stroke="url(#grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 120 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
