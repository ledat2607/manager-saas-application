// routes/auth/auth-layout.tsx
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import AuthGradientPanel from "./_components/auth-gradient-panel";

export default function AuthLayout() {
  const location = useLocation();
  const isSignUp = location.pathname.includes("sign-up");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-6xl h-170 rounded-2xl overflow-hidden border shadow-xl bg-card grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT – FORM */}
        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Outlet />
            <div className="pointer-events-none -z-20 absolute bottom-30 -right-30 block h-72 w-72 rounded-full bg-linear-to-tr from-primary via-purple-400 to-pink-500 blur-3xl lg:hidden" />
          </div>
        </div>

        {/* RIGHT – GRADIENT PANEL */}
        <div className="hidden lg:block relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial={{ x: isSignUp ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isSignUp ? "-100%" : "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <AuthGradientPanel mode={isSignUp ? "signup" : "signin"} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
