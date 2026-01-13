import { motion } from "framer-motion";

type Props = {
  text: string;
};

export default function AnimatedHeading({ text }: Props) {
  const letters = text.split("");

  return (
    <motion.h2
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="font-space text-4xl xl:text-5xl font-extrabold text-center tracking-tight"
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: "easeOut",
              },
            },
          }}
          className="bg-clip-text text-transparent bg-linear-to-r from-white to-white/70 inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h2>
  );
}
