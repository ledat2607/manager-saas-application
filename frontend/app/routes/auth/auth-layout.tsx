import { Navigate, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import AuthGradientPanel from "./_components/auth-gradient-panel";
import { userAuth } from "@/provider/auth-context";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = userAuth();
  const location = useLocation();


  // 1. Danh sách các trang muốn hiển thị Gradient Panel bên phải
  const showGradientPanel = ["/sign-in", "/sign-up"].includes(
    location.pathname,
  );

  if (isLoading) return <div>Loading....</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  const isSignUp = location.pathname.includes("sign-up");

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-background px-4`}
    >
      <div
        className={`relative w-full max-w-6xl h-170 rounded-2xl overflow-hidden border ${showGradientPanel ? "bg-background shadow-xl" : "bg-transparent shadow-none"} grid grid-cols-1 ${
          showGradientPanel ? "lg:grid-cols-2" : "lg:grid-cols-1 w-full"
          /* 👆 Nếu không có panel, thu nhỏ max-width lại cho đẹp */
        }`}
      >
        {/* LEFT – FORM */}
        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Outlet />
            {/* Background trang trí cho mobile */}
            <div className="pointer-events-none -z-20 absolute bottom-30 -right-30 block h-72 w-72 rounded-full bg-linear-to-tr from-primary via-purple-400 to-pink-500 blur-3xl lg:hidden" />
          </div>
        </div>

        {/* RIGHT – GRADIENT PANEL (Chỉ hiện khi thỏa điều kiện cờ) */}
        {showGradientPanel && (
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
        )}
      </div>
    </div>
  );
}
