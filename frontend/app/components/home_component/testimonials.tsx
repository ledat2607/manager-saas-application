import { motion } from "framer-motion";
import { GlassCard } from "./glass-chart";

const testimonials = [
  {
    name: "Alex Nguyen",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/100?img=12",
    quote:
      "Task Manager helps me stay focused and visualize my progress clearly every day.",
  },
  {
    name: "Linh Tran",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/100?img=32",
    quote:
      "The interface feels smooth and modern. I actually enjoy managing my tasks now.",
  },
  {
    name: "Minh Pham",
    role: "Team Lead",
    avatar: "https://i.pravatar.cc/100?img=56",
    quote: "Tracking team progress has never been this simple and transparent.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold md:text-4xl">
          Loved by
          <span className="ml-2 bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
            Users
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Trusted by creators, developers, and teams worldwide
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              y: -10,
              boxShadow: "0 30px 60px -20px rgba(99,102,241,0.45)",
            }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard className="h-full p-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">“{item.quote}”</p>

                <div className="flex items-center gap-3 pt-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
