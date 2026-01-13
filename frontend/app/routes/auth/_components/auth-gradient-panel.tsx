import AnimatedHeading from "./animated-heading.";

type Props = {
  mode: "signin" | "signup";
};

export default function AuthGradientPanel({ mode }: Props) {
  return (
    <div
      className={`
        h-full w-full flex flex-col items-center justify-center
        px-12 text-white
        bg-linear-to-br
        ${
          mode === "signin"
            ? "from-indigo-600 via-purple-600 to-pink-500"
            : "from-emerald-500 via-teal-500 to-cyan-500"
        }
      `}
    >
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">
          <img src="./logoTM.png" alt="" className="w-10 h-8" />
        </div>
        <span className="text-2xl font-bold tracking-tight">Task Manager</span>
      </div>

      {/* Big text */}
      <AnimatedHeading
        text={mode === "signin" ? "Welcome Back" : "Create Account"}
      />

      <p className="text-white/80 text-center max-w-sm">
        {mode === "signin"
          ? "Manage your tasks efficiently and stay productive every day."
          : "Start organizing your workflow and boost your productivity today."}
      </p>
    </div>
  );
}
